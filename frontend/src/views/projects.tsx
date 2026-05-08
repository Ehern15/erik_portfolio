import { Link } from "react-router-dom"
import { projects } from "@/lib/projects-data"

export function Projects() {
    return (
        <section id="projects" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-3">Work</p>
                <h2 className="!text-4xl font-bold text-white mb-16">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <Link
                            key={project.slug}
                            to={`/projects/${project.slug}`}
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
                            <span className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors">
                                View project →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
