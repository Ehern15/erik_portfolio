export interface ProjectData {
    slug: string
    title: string
    description: string
    fullDescription: string
    whatIBuilt: string[]
    tags: string[]
    github?: string
    live?: string
}

export const projects: ProjectData[] = [
    {
        slug: "portfolio",
        title: "Portfolio Website",
        description: "Personal portfolio deployed on AWS via CDK with a serverless AI chatbot powered by Gemini 2.0 Flash Lite running entirely on the free tier.",
        fullDescription:
            "The site you're looking at. Built with React and TypeScript, bundled with Vite, and deployed to AWS entirely through CDK — infrastructure as code. An S3 bucket serves the static build; CloudFront sits in front for global CDN delivery, HTTPS enforcement via ACM, and automatic cache invalidation on each deploy. The origin was migrated from OAI to OAC for improved security. The site includes a serverless AI assistant powered by Google AI Studio (Gemma 3 4B) — requests go through an API Gateway and Lambda function, with a DynamoDB daily usage counter, API Gateway throttling, and an AWS Budget alert that automatically disables the chat if costs approach $1/month. CloudFront path rewriting routes /api/* to the API Gateway so the frontend uses a relative URL with no CORS issues.",
        whatIBuilt: [
            "Full AWS infrastructure in CDK: S3 bucket, CloudFront distribution, ACM certificate, and Route 53 A record",
            "Migrated CloudFront origin access from OAI to OAC",
            "Serverless AI chatbot via Lambda + API Gateway + Google AI Studio (Gemini 2.0 Flash Lite), running on the free tier",
            "Multi-layer cost controls: DynamoDB atomic daily request counter (hard cap at 800/day), API Gateway throttling (2 req/sec), Lambda reserved concurrency, and an AWS Budget alert that auto-disables chat at $0.80/month",
            "CloudFront Function that rewrites /api/* paths to route browser requests to API Gateway without CORS headers",
            "Animated star field background using randomized CSS box-shadow generation",
            "Shooting star animation that alternates direction every 50 seconds using a React interval",
            "Responsive layout with Tailwind CSS and Radix UI primitives",
        ],
        tags: ["React", "TypeScript", "AWS CDK", "CloudFront", "S3", "Lambda", "DynamoDB", "API Gateway", "Google AI Studio", "Vite"],
        github: "https://github.com/Ehern15/erik_portfolio",
        live: "https://erik-hernandez.com",
    },
    {
        slug: "chronos",
        title: "Chronos",
        description: "Production time clock system deployed across all Miami-Dade County DMV locations, serving 400 daily users. Multi-factor biometric clock-in with badge hardware and AI facial recognition.",
        fullDescription:
            "Chronos is a production time clock system running across every Miami-Dade County DMV location, used by 400 employees daily. It integrates with existing badge hardware for identity verification and layers in AI-powered facial recognition via a self-hosted Compreface instance — an open-source recognition service deployed as a multi-container Docker Compose stack on a remote server, accessible only through the Spring Boot backend to keep it off the public network. Liveness detection powered by Google MediaPipe guards against photo spoofing by verifying the user is physically present in real time. The result is a multi-factor biometric clock-in flow running reliably at government scale across multiple county facilities.",
        whatIBuilt: [
            "React frontend for the clock-in flow, integrating badge scan and facial recognition steps into a single UI",
            "Self-hosted Compreface facial recognition service deployed as a multi-container Docker Compose stack",
            "Spring Boot backend that proxies all biometric requests, keeping the recognition service off the public network",
            "MediaPipe liveness detection to reject photo spoofing attempts before sending frames to Compreface",
            "PostgreSQL schema and backend logic for tracking clock-in/out events across all DMV locations",
        ],
        tags: ["React", "Spring Boot", "PostgreSQL", "MediaPipe", "Compreface", "Docker"],
    },
    {
        slug: "looper",
        title: "Looper",
        description: "A browser-based audio looping app built with Astro and TypeScript. Controls and layers audio loops entirely client-side using the Web Audio API — no server needed.",
        fullDescription:
            "Looper is a browser-based metronome and audio looping tool built with Astro and TypeScript. I built the UI layer — the component structure that lets users control playback and BPM in real time. State (BPM, play/pause, mute) is shared across Astro island components using Nanostores, so each control stays in sync without a full SPA framework. The underlying audio engine uses the Web Audio API scheduler pattern and Tone.js for sample playback.",
        whatIBuilt: [
            "UI components in Astro: BPM controller, play/pause button, mute toggle, and audio player",
            "Integrated the UI controls with the Web Audio API metronome and Tone.js transport layer",
        ],
        tags: ["Astro", "TypeScript", "Web Audio API", "Tone.js", "Nanostores"],
        github: "https://github.com/Ehern15/looper",
    },
    {
        slug: "mtg-price-guess",
        title: "MTG Price Guess",
        description: "A collaborative TCG guessing game where players pick which of two cards is worth more. I built the game selection landing page.",
        fullDescription:
            "MTG Price Guess is a React app where players are shown two trading cards and guess which one is worth more. I contributed the game selection landing page — the first screen players see before choosing between Magic: The Gathering and Pokémon. The page had to work cleanly on both mobile and desktop, and route the player into the correct game flow based on their choice.",
        whatIBuilt: [
            "Built the ChooseGamePresentation component: logo, header, description, and interactive card buttons for each TCG",
            "Added hover scale animation on the game card buttons and polished the mobile and desktop layouts with Tailwind",
            "Implemented ChooseGameState to handle click events and lift the selected game up to the state orchestrator",
            "Created a useImage hook for dynamic asset imports using Vite's import.meta.url pattern",
            "Fixed the state orchestrator so the landing page shows by default instead of jumping straight into the MTG game",
        ],
        tags: ["React", "TypeScript", "Tailwind CSS"],
        github: "https://github.com/Dgarc359/mtg-price-guess",
    },
]

export function getProject(slug: string): ProjectData | undefined {
    return projects.find(p => p.slug === slug)
}
