export class Color {
    constructor(public readonly red: number,        // 0--255
                public readonly green: number,      // 0--255
                public readonly blue: number,       // 0--255
                public readonly alpha: number) {    // 0--1
    }

    toStyle() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
}

const hexPattern = /^[0-9a-fA-F]+$/;

export function toColor(hexCode: string): Color {
    hexCode = hexCode.trim();
    if (hexCode.length !== 6 && hexCode.length !== 8) {
        throw new Error('Bad length.');
    }
    if (!hexPattern.test(hexCode)) {
        throw new Error('Not hex.');
    }
    const red = Number.parseInt(hexCode.substring(0, 2), 16);
    const green = Number.parseInt(hexCode.substring(2, 4), 16);
    const blue = Number.parseInt(hexCode.substring(4, 6), 16);
    const alpha = ((hexCode.length === 8) ? Number.parseInt(hexCode.substring(6, 8), 16) : 255) / 255;
    return new Color(red, green, blue, alpha);
}