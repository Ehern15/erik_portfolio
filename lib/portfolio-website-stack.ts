import * as cdk from 'aws-cdk-lib';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path = require('path');

export class PortfolioWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const siteDomain = "erik-hernandez.com";
    const zone = cdk.aws_route53.HostedZone.fromLookup(this,"zone",{
      domainName: siteDomain
    })

    const siteBucket = new cdk.aws_s3.Bucket(this,"portfolio-web-bucket",{
      bucketName: "ehern-portfolio-web-bucket",
      publicReadAccess: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const certificate = new cdk.aws_certificatemanager.Certificate(this,"site-certificate",{
      domainName: siteDomain,
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(zone)
    })

    const cloudfrontDistribution = new cdk.aws_cloudfront.Distribution(this,"site-distribution",{
      certificate,
      defaultRootObject: "index.html",
      domainNames: [siteDomain],
      minimumProtocolVersion: cdk.aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(30)
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(30)
        },
      ],
      defaultBehavior: {
        origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        compress: true,
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    })

    new cdk.aws_route53.ARecord(this,"site-A-record",{
      recordName: siteDomain,
      target: cdk.aws_route53.RecordTarget.fromAlias(new cdk.aws_route53_targets.CloudFrontTarget(cloudfrontDistribution)),
      zone
    })

    new cdk.aws_s3_deployment.BucketDeployment(this,"deployment-with-invalidation",{
      sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname,"../frontend/dist"))],
      destinationBucket: siteBucket,
      distribution: cloudfrontDistribution,
      distributionPaths: ["/*"]
    })

    // ── Chat cost guard ─────────────────────────────────────────────────────────
    //
    // AWS Budgets sends an SNS notification when monthly spend hits 80% of $1.
    // The Lambda responds by writing {"chatEnabled": false} to config.json in S3.
    // The chatbot fetches config.json before activating.
    // Re-deploying the stack resets config.json to {"chatEnabled": true}.
    //
    // NOTE: AWS Budgets requires the SNS topic to be in us-east-1.
    // Ensure this stack is deployed to us-east-1.

    const budgetAlertTopic = new cdk.aws_sns.Topic(this, 'budget-alert-topic', {
      displayName: 'Portfolio Budget Alert',
    })

    budgetAlertTopic.addToResourcePolicy(new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [new cdk.aws_iam.ServicePrincipal('budgets.amazonaws.com')],
      actions: ['SNS:Publish'],
      resources: [budgetAlertTopic.topicArn],
    }))

    const disableChatFn = new cdk.aws_lambda.Function(this, 'disable-chat-fn', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: cdk.aws_lambda.Code.fromInline(`
        const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
        const s3 = new S3Client({});
        exports.handler = async () => {
          await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: 'config.json',
            Body: JSON.stringify({ chatEnabled: false }),
            ContentType: 'application/json',
            CacheControl: 'no-cache, no-store',
          }));
          console.log('Chat disabled: monthly budget threshold reached.');
        };
      `),
      environment: { BUCKET_NAME: siteBucket.bucketName },
    })

    siteBucket.grantPut(disableChatFn)

    budgetAlertTopic.addSubscription(
      new snsSubscriptions.LambdaSubscription(disableChatFn)
    )

    new cdk.aws_budgets.CfnBudget(this, 'portfolio-budget', {
      budget: {
        budgetName: 'portfolio-site-budget',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: 1, unit: 'USD' },
      },
      notificationsWithSubscribers: [{
        notification: {
          notificationType: 'ACTUAL',
          comparisonOperator: 'GREATER_THAN',
          threshold: 80,
          thresholdType: 'PERCENTAGE',
        },
        subscribers: [{
          subscriptionType: 'SNS',
          address: budgetAlertTopic.topicArn,
        }],
      }],
    })

    // ── Chat backend ─────────────────────────────────────────────────────────────

    // Daily request counter. DynamoDB free tier (25 WCU/RCU) covers this easily.
    const usageTable = new cdk.aws_dynamodb.Table(this, 'chat-usage-table', {
      partitionKey: { name: 'date', type: cdk.aws_dynamodb.AttributeType.STRING },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // Chat Lambda — proxies requests to Google AI Studio (Gemma).
    // reservedConcurrentExecutions caps simultaneous invocations so a traffic
    // spike can't fan out to hundreds of Gemini API calls at once.
    const chatFn = new NodejsFunction(this, 'chat-fn', {
      entry: path.join(__dirname, '../lambda/chat/index.ts'),
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        GEMINI_API_KEY: cdk.aws_ssm.StringParameter.valueForStringParameter(
          this, '/portfolio/gemini-api-key'
        ),
        USAGE_TABLE: usageTable.tableName,
        DAILY_LIMIT: '800',
        ALLOWED_ORIGIN: `https://${siteDomain}`,
      },
      bundling: {
        externalModules: ['@aws-sdk/*'],
      },
    })

    usageTable.grantReadWriteData(chatFn)

    // REST API Gateway with stage-level throttling.
    // 2 req/sec sustained, 10 req/sec burst — well-suited for a portfolio chatbot.
    const chatApi = new cdk.aws_apigateway.RestApi(this, 'chat-api', {
      restApiName: 'portfolio-chat-api',
      deployOptions: {
        stageName: 'prod',
        throttlingBurstLimit: 10,
        throttlingRateLimit: 2,
      },
    })

    chatApi.root
      .addResource('chat')
      .addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(chatFn))

    // CloudFront Function rewrites /api/chat → /chat before forwarding to
    // API Gateway, so the frontend can use a relative URL with no CORS issues.
    const pathRewriteFn = new cdk.aws_cloudfront.Function(this, 'api-path-rewrite', {
      runtime: cdk.aws_cloudfront.FunctionRuntime.JS_2_0,
      code: cdk.aws_cloudfront.FunctionCode.fromInline(
        `function handler(event) {
  var req = event.request;
  req.uri = req.uri.replace(/^\\/api/, '') || '/';
  return req;
}`
      ),
    })

    cloudfrontDistribution.addBehavior('/api/*',
      new cdk.aws_cloudfront_origins.HttpOrigin(
        `${chatApi.restApiId}.execute-api.${this.region}.amazonaws.com`,
        { originPath: `/${chatApi.deploymentStage.stageName}` }
      ),
      {
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: cdk.aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        functionAssociations: [{
          function: pathRewriteFn,
          eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      }
    )
  }
}
