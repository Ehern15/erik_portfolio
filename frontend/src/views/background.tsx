import { useEffect, useMemo, useState } from "react"
import { generateStars } from "@/lib/stars"

export function Background() {
    const [gravity, setGravity] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => setGravity(prev => !prev), 50000)
        return () => clearInterval(interval)
    }, [])

    const starVars = useMemo(() => ({
        '--star-shadow-1': generateStars(300, [
            ['#fff', 75],
            ['var(--red-stars)', 10],
            ['var(--yellow-stars)', 8],
            ['var(--blue-stars)', 7],
        ]),
        '--star-shadow-2': generateStars(80, [
            ['#fff', 20],
            ['var(--yellow-stars)', 50],
            ['var(--blue-stars)', 30],
        ]),
        '--star-shadow-3': generateStars(40, [
            ['#fff', 60],
            ['var(--yellow-stars)', 20],
            ['var(--red-stars)', 20],
        ]),
    }), [])

    return (
        <div
            id='galaxy-bg'
            style={starVars as React.CSSProperties}
            className={gravity ? "gravity" : ""}
        >
            <div id='stars' />
            <div id='stars2' />
            <div id='stars3' />
            <div id='stars4' />
            <div id='stars5' />
            <div id='stars6' />
            {gravity ? (
                <div className='shooting-stars south'><div className='head' /></div>
            ) : (
                <div className='shooting-stars north'><div className='head' /></div>
            )}
            <div className='alien-x'>
                <div className='alien-y'>
                    <img className='alien-img' src='/android-chrome-192x192.png' alt='' />
                </div>
            </div>
        </div>
    )
}
