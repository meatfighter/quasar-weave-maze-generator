const MARGIN_INCHES = .25;
const DPI = 72;
const MILLIMETERS_PER_INCH = 25.4;

export const MARGIN_DOTS = DPI * MARGIN_INCHES;

enum DimensionUnits {
    INCHES,
    MILLIMETERS,
}

export function toPaperSize(paperSize: string | undefined): PaperSize {
    if (!paperSize) {
        return DEFAULT_PAPER_SIZE;
    }
    switch (paperSize.trim().toLowerCase()) {
        case 'letter':
            return PaperSize.LETTER;
        case 'tabloid':
            return PaperSize.TABLOID;
        case 'legal':
            return PaperSize.LEGAL;
        case 'statement':
            return PaperSize.STATEMENT;
        case 'executive':
            return PaperSize.EXECUTIVE;
        case 'folio':
            return PaperSize.FOLIO;
        case 'quarto':
            return PaperSize.QUARTO;
        case 'a3':
            return PaperSize.A3;
        case 'a4':
            return PaperSize.A4;
        case 'a5':
            return PaperSize.A5;
        case 'b4':
            return PaperSize.B4_JIS;
        case 'b5':
            return PaperSize.B5_JIS;
        case 'fit':
            return PaperSize.FIT;
    }
    throw new Error('\nUnknown paper size.\n');
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