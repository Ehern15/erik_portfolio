const navItems = ['About', 'Projects', 'Skills', 'Contact'] as const

export function TopNav() {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/10">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                <a
                    href="#about"
                    className="text-white font-bold text-lg tracking-tight hover:text-purple-400 transition-colors"
                >
                    EH
                </a>
                <div className="flex gap-8">
                    {navItems.map(item => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    )
}
