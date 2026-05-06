export function Footer() {
    return (
        <footer id="contact" className="py-12 px-6 border-t border-white/10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-white/30 text-sm">© 2025 Erik Hernandez</p>
                <div className="flex gap-8">
                    <a
                        href="https://www.linkedin.com/in/erik-hernandez-fiu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/Ehern15"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                        GitHub
                    </a>
                    <a
                        href="mailto:erikhern15@gmail.com"
                        className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                        Email
                    </a>
                </div>
            </div>
        </footer>
    )
}
