export function About() {
    return (
        <section id="about" className="min-h-screen flex flex-col justify-center px-6 py-20">
            <div className="max-w-5xl mx-auto w-full">
                <p className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-6">
                    Software Developer
                </p>
                <h1 className="!text-7xl md:!text-8xl lg:!text-9xl font-bold text-white leading-none mb-8">
                    Erik<br />Hernandez
                </h1>
                <p className="text-white/50 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                    Software Developer at the Miami-Dade Office of the Tax Collector, where I build
                    both internal tools and citizen-facing applications. Recently focused on integrating
                    AI with software to provide business solutions. I work primarily with React and
                    Java Spring Boot on PostgreSQL, with a growing interest in cybersecurity and cloud
                    infrastructure.
                </p>
                <div className="flex flex-wrap gap-4">
                    <a
                        href="https://github.com/Ehern15"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 border border-white/20 text-white/80 hover:border-purple-500 hover:text-purple-400 transition-all rounded text-sm font-medium"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/erik-hernandez-fiu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 border border-white/20 text-white/80 hover:border-purple-500 hover:text-purple-400 transition-all rounded text-sm font-medium"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="mailto:erikhern15@gmail.com"
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white transition-all rounded text-sm font-medium"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </section>
    )
}
