export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return { r, g, b };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b]
        .map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
};

export const generatePastelColor = (baseColor: string, index: number, totalItems: number): string => {
    const { r, g, b } = hexToRgb(baseColor);

    const pastelFactor = 0.5 + (index / (totalItems * 2));

    const newR = Math.floor(r + (255 - r) * pastelFactor);
    const newG = Math.floor(g + (255 - g) * pastelFactor);
    const newB = Math.floor(b + (255 - b) * pastelFactor);

    return rgbToHex(newR, newG, newB);
};

export const generatePastelColors = (baseColor: string, columns: number, rows: number): string[] => {
    const totalItems = columns * rows;
    return Array.from({ length: totalItems }, (_, i) =>
        generatePastelColor(baseColor, i, totalItems)
    );
};