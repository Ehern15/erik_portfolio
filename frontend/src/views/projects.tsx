interface Project {
    title: string
    description: string
    tags: string[]
    github?: string
    live?: string
}

// TODO: Update each project with accurate descriptions, correct tags, and real links
const projects: Project[] = [
    {
        title: "Looper",
        description: "A browser-based audio looping app built with Astro and TypeScript. Records and layers audio loops entirely client-side using the Web Audio API — no server needed.",
        tags: ["Astro", "TypeScript", "Web Audio API"],
        github: "https://github.com/Ehern15/looper",
    },
    {
        title: "TCG Higher or Lower",
        description: "TODO: Add a description of this project.",
        tags: ["JavaScript"],
        github: "https://github.com/Ehern15",
    },
    {
        title: "Portfolio Website",
        description: "Personal portfolio deployed on AWS via CDK. Uses CloudFront for global CDN delivery with S3 static hosting.",
        tags: ["React", "TypeScript", "AWS CDK", "CloudFront"],
        github: "https://github.com/Ehern15/erik_portfolio",
    },
    {
        title: "Chronos",
        description: "Production time clock system deployed across all Miami-Dade County DMV locations, serving 400 daily users. Integrates with existing badge hardware for identity verification and layers in AI-powered facial recognition via a self-hosted Compreface instance — an open-source recognition service deployed as a multi-container Docker Compose stack and secured on a remote server, accessed exclusively through the Spring Boot backend to keep it off the public network. Liveness detection powered by Google MediaPipe guards against photo spoofing by verifying the user is physically present in real time. The result is a multi-factor biometric clock-in flow running reliably at government scale across multiple county facilities.",
        tags: ["React", "Spring Boot", "PostgreSQL", "MediaPipe", "Compreface", "Docker"],
    },
    // TODO: Add more recent projects here
]

export function Projects() {
    return (
        <section id="projects" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-3">Work</p>
                <h2 className="!text-4xl font-bold text-white mb-16">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div
                            key={project.title}
                            className="flex flex-col p-6 rounded-lg border border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all duration-300"
                        >
                            <h3 className="text-white font-semibold text-lg mb-3">{project.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/30"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/40 hover:text-white text-xs font-medium transition-colors"
                                    >
                                        GitHub →
                                    </a>
                                )}
                                {project.live && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/40 hover:text-purple-400 text-xs font-medium transition-colors"
                                    >
                                        Live →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
