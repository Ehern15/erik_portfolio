import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
      errorResponses: [{
        httpStatus: 403,
        responseHttpStatus: 403,
        responsePagePath: "/index.html",
        ttl: cdk.Duration.minutes(30)
      }],
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
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'PortfolioWebsiteQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
