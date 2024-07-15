const MARGIN_INCHES = .25;
const DPI = 72;
const MILLIMETERS_PER_INCH = 25.4;

export const MARGIN_DOTS = DPI * MARGIN_INCHES;

enum DimensionUnits {
    INCHES,
    MILLIMETERS,
}

export class PaperSize {

    readonly widthDots: number;
    readonly heightDots: number;
    readonly printableWidthDots: number;
    readonly printableHeightDots: number;

    constructor(public name: string, public width: number, public height: number,
                public units = DimensionUnits.INCHES) {

        let widthInches = width;
        let heightInches = height;
        if (units === DimensionUnits.MILLIMETERS) {
            widthInches /= MILLIMETERS_PER_INCH;
            heightInches /= MILLIMETERS_PER_INCH;
        }
        this.widthDots = DPI * widthInches;
        this.heightDots = DPI * heightInches;
        this.printableWidthDots = this.widthDots - 2 * MARGIN_DOTS;
        this.printableHeightDots = this.heightDots - 2 * MARGIN_DOTS;
    }

    equals(other: PaperSize): boolean {
        return this === other || this.name === other.name;
    }

    static readonly LETTER = new PaperSize('Letter', 8.5, 11);
    static readonly TABLOID = new PaperSize('Tabloid', 11, 17);
    static readonly LEGAL = new PaperSize('Legal', 8.5, 14);
    static readonly STATEMENT = new PaperSize('Statement', 5.5, 8.5);
    static readonly EXECUTIVE = new PaperSize('Executive', 7.25, 10.5);
    static readonly FOLIO = new PaperSize('Folio', 8.5, 13.5);
    static readonly QUARTO = new PaperSize('Quarto', 8.5, 10 + 5/6);
    static readonly A3 = new PaperSize('A3', 297, 420, DimensionUnits.MILLIMETERS);
    static readonly A4 = new PaperSize('A4', 210, 297, DimensionUnits.MILLIMETERS);
    static readonly A5 = new PaperSize('A5', 148, 210, DimensionUnits.MILLIMETERS);
    static readonly B4_JIS = new PaperSize('B4 (JIS)', 257, 364, DimensionUnits.MILLIMETERS);
    static readonly B5_JIS = new PaperSize('B5 (JIS)', 182, 257, DimensionUnits.MILLIMETERS);
    static readonly FIT = new PaperSize('Fit', 0, 0);
}

export const DEFAULT_PAPER_SIZE = PaperSize.LETTER;

export const PAPER_SIZES = [
    PaperSize.LETTER,
    PaperSize.TABLOID,
    PaperSize.LEGAL,
    PaperSize.STATEMENT,
    PaperSize.EXECUTIVE,
    PaperSize.FOLIO,
    PaperSize.QUARTO,
    PaperSize.A3,
    PaperSize.A4,
    PaperSize.A5,
    PaperSize.B4_JIS,
    PaperSize.B5_JIS,
    PaperSize.FIT,
];

export function toPaperSize(name: string): PaperSize {
    for (const paperSize of PAPER_SIZES) {
        if (name === paperSize.name) {
            return paperSize;
        }
    }
    return DEFAULT_PAPER_SIZE;
}