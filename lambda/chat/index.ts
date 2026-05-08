import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { GoogleGenerativeAI } from '@google/generative-ai'

const db = new DynamoDBClient({})
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT ?? '800')
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'https://erik-hernandez.com'
const TABLE = process.env.USAGE_TABLE!

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genai.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    systemInstruction: `You are a helpful assistant on Erik Hernandez's portfolio website. Answer questions about Erik's background, skills, and projects concisely and warmly.

Erik Hernandez is a software engineer with experience in React, TypeScript, Spring Boot, AWS, and Docker.

Projects:
- Chronos: Production biometric time clock across all Miami-Dade County DMV locations (400 daily users). Multi-factor clock-in via badge hardware, self-hosted AI facial recognition (Compreface), and MediaPipe liveness detection. Stack: React, Spring Boot, PostgreSQL, Docker.
- Portfolio Website: This site. React/TypeScript with Vite, deployed to AWS via CDK — S3, CloudFront, ACM, Route 53. Includes a serverless AI chatbot (this one) powered by Google AI Studio (Gemini 2.0 Flash Lite) via Lambda + API Gateway + DynamoDB, with multi-layer cost controls and CloudFront path rewriting.
- Looper: Browser-based audio looping app in Astro/TypeScript. Built the UI — BPM controller, play/pause, mute. State shared across Astro island components via Nanostores.
- MTG Price Guess: React TCG guessing game. Built the game selection landing page with card buttons and routing logic.

Keep answers brief and friendly. If asked about anything unrelated to Erik or software engineering, politely redirect.`,
})

const ALLOWED_TOPICS = [
    // Erik / personal
    'erik', 'hernandez', 'you', 'your', 'his', 'he',
    // Projects
    'chronos', 'looper', 'mtg', 'magic', 'pokemon', 'portfolio', 'project',
    // Tech stack
    'react', 'typescript', 'javascript', 'spring', 'boot', 'java', 'aws',
    'docker', 'postgres', 'sql', 'python', 'node', 'vite', 'cdk',
    'cloudfront', 'lambda', 'dynamo', 's3', 'mediapipe', 'compreface',
    'astro', 'api', 'gateway', 'gemma', 'gemini', 'ai', 'chatbot',
    // Career
    'skill', 'experience', 'background', 'work', 'job', 'hire', 'hiring',
    'resume', 'cv', 'engineer', 'developer', 'dev', 'software', 'code',
    'built', 'build', 'develop', 'contribut',
    // General question words that are fine to pass through
    'hi', 'hello', 'hey', 'what', 'how', 'who', 'tell', 'about', 'show',
    'explain', 'describe', 'can', 'does', 'did', 'is', 'are', 'was',
]

function isOnTopic(message: string): boolean {
    const lower = message.toLowerCase()
    return ALLOWED_TOPICS.some(t => lower.includes(t))
}

const OFF_TOPIC_REPLY = "I'm only set up to answer questions about Erik's background, skills, and projects. Feel free to ask me about those!"

const CORS = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
}

export const handler = async (event: any) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS, body: '' }
    }

    // 1. Parse & validate — free, no external calls
    let body: { message?: unknown; history?: unknown[] }
    try {
        body = JSON.parse(event.body ?? '{}')
    } catch {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid_json' }) }
    }

    const { message, history = [] } = body

    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 1000) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'invalid_message' }) }
    }

    // 2. Topic filter — free, no external calls, no counter increment
    if (!isOnTopic(message)) {
        return {
            statusCode: 200,
            headers: CORS,
            body: JSON.stringify({ reply: OFF_TOPIC_REPLY }),
        }
    }

    // 3. Daily counter — only reached for valid, on-topic messages
    const today = new Date().toISOString().split('T')[0]
    const ttl = Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60

    try {
        await db.send(new UpdateItemCommand({
            TableName: TABLE,
            Key: { date: { S: today } },
            UpdateExpression: 'ADD #c :inc SET #ttl = if_not_exists(#ttl, :ttl)',
            ConditionExpression: 'attribute_not_exists(#c) OR #c < :lim',
            ExpressionAttributeNames: { '#c': 'count', '#ttl': 'ttl' },
            ExpressionAttributeValues: {
                ':inc': { N: '1' },
                ':lim': { N: String(DAILY_LIMIT) },
                ':ttl': { N: String(ttl) },
            },
        }))
    } catch (e: any) {
        if (e.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 429,
                headers: CORS,
                body: JSON.stringify({ error: 'daily_limit' }),
            }
        }
        throw e
    }

    // 4. Gemini API call — only reached if on-topic and under limit
    const chat = model.startChat({ history: history as any[] })
    const result = await chat.sendMessage(message.trim())
    const reply = result.response.text()

    return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ reply }),
    }
}
