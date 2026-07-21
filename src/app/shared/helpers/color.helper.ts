export class ColorHelper {
    static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const cleaned = hex.replace('#', '').trim();

        // Support shorthand hex (#f00 -> #ff0000)
        const fullHex =
            cleaned.length === 3
                ? cleaned
                      .split('')
                      .map((c) => c + c)
                      .join('')
                : cleaned;

        if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
            return null;
        }

        const r = parseInt(fullHex.substring(0, 2), 16);
        const g = parseInt(fullHex.substring(2, 4), 16);
        const b = parseInt(fullHex.substring(4, 6), 16);

        return { r, g, b };
    }
}
