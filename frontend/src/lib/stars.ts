type StarColor = '#fff' | 'var(--red-stars)' | 'var(--yellow-stars)' | 'var(--blue-stars)'
type ColorWeight = [StarColor, number]

function pickColor(weights: ColorWeight[]): StarColor {
    const total = weights.reduce((sum, [, w]) => sum + w, 0)
    let r = Math.random() * total
    for (const [color, weight] of weights) {
        r -= weight
        if (r <= 0) return color
    }
    return weights[0][0]
}

export function generateStars(count: number, colorWeights: ColorWeight[], area = 2000): string {
    const shadows: string[] = []
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * area)
        const y = Math.floor(Math.random() * area)
        shadows.push(`${x}px ${y}px ${pickColor(colorWeights)}`)
    }
    return shadows.join(', ')
}
