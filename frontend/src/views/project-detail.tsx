import { useParams, Link } from "react-router-dom"
import { Github } from "lucide-react"
import { getProject } from "@/lib/projects-data"

export function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>()
    const project = slug ? getProject(slug) : undefined

    if (!project) {
        return (
            <section className="py-24 px-6 min-h-[60vh] flex flex-col items-center justify-center">
                <p className="text-white/50 text-lg mb-6">Project not found.</p>
                <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                    ← Back to portfolio
                </Link>
            </section>
        )
    }

    return (
        <section className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/#projects"
                    className="inline-flex items-center text-white/40 hover:text-white text-sm font-medium transition-colors mb-12"
                >
                    ← Back to projects
                </Link>

                <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-purple-400 text-xs tracking-[0.3em] uppercase">Project</p>
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors"
                        >
                            <Github size={16} />
                            GitHub
                        </a>
                    )}
                </div>
                <h1 className="text-4xl font-bold text-white mb-6">{project.title}</h1>

                <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags.map(tag => (
                        <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/30"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-8 mb-8">
                    <p className="text-white/70 text-base leading-relaxed">{project.fullDescription}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-8 mb-10">
                    <h2 className="text-white font-semibold text-lg mb-5">What I built</h2>
                    <ul className="space-y-3">
                        {project.whatIBuilt.map((item, i) => (
                            <li key={i} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                                <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {project.live && (
                    <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-purple-400 text-sm font-medium transition-colors"
                    >
                        Live site →
                    </a>
                )}
            </div>
        </section>
    )
}
