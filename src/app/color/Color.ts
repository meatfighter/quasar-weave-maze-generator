export class Color {
    constructor(public readonly red: number,        // 0--255
                public readonly green: number,      // 0--255
                public readonly blue: number,       // 0--255
                public readonly alpha: number) {    // 0--1
    }
}

export function toRgba(color: Color) {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

export function toHexCode(color: Color) {
    const r = color.red.toString(16).padStart(2, '0');
    const g = color.green.toString(16).padStart(2, '0');
    const b = color.blue.toString(16).padStart(2, '0');
    const a = Math.round(255 * color.alpha).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`;
}

const hexPattern = /^#[0-9a-fA-F]+$/;

export function toColor(hexCode: string): Color {
    hexCode = hexCode.trim();
    if (hexCode.length !== 7 && hexCode.length !== 9) {
        throw new Error('Bad length.');
    }
    if (!hexPattern.test(hexCode)) {
        throw new Error('Not hex.');
    }
    const red = Number.parseInt(hexCode.substring(1, 3), 16);
    const green = Number.parseInt(hexCode.substring(3, 5), 16);
    const blue = Number.parseInt(hexCode.substring(5, 7), 16);
    const alpha = ((hexCode.length === 9) ? Number.parseInt(hexCode.substring(7, 9), 16) : 255) / 255;
    return new Color(red, green, blue, alpha);
}