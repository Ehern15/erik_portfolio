interface SkillGroup {
    label: string
    items: string[]
}

const skillGroups: SkillGroup[] = [
    {
        label: "Languages",
        items: ["JavaScript", "TypeScript", "Java", "Python", "C", "SQL"],
    },
    {
        label: "Frameworks & Tools",
        items: ["React", "Spring Boot", "TailwindCSS", "AWS CDK", "Express", "Node.js", "Vite", "Astro"],
    },
    {
        label: "Technologies",
        items: ["PostgreSQL", "MySQL", "MongoDB", "AWS", "Git"],
    },
]

export function Skills() {
    return (
        <section id="skills" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-3">Capabilities</p>
                <h2 className="!text-4xl font-bold text-white mb-16">Skills</h2>
                <div className="flex flex-col gap-12">
                    {skillGroups.map(group => (
                        <div key={group.label}>
                            <h3 className="text-white/30 text-xs tracking-widest uppercase mb-5">{group.label}</h3>
                            <div className="flex flex-wrap gap-3">
                                {group.items.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 rounded-full border border-white/15 text-white/70 text-sm hover:border-purple-500/60 hover:text-purple-300 hover:bg-purple-900/20 transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
