import { jsPDF } from 'jspdf';
import { Renderer } from 'src/app/render/Renderer';
import { Color } from 'src/app/color/Color';
import { CurveRenderer } from 'src/app/render/CurveRenderer';
import { PaperSize } from 'src/app/file/PaperSize';

export class PdfRenderer extends CurveRenderer {

    private doc = new jsPDF();

    constructor(ignoreWhiteFill: boolean) {
        super(ignoreWhiteFill);
    }

    setSize(width: number, height: number, paperSize: PaperSize): Renderer {
        if (paperSize === PaperSize.FIT) {
            this.doc = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [ width, height ],
            });
        } else {
            let w1 = paperSize.printableWidthDots;
            let s1 = w1 / width;
            let h1 = s1 * height;
            if (h1 > paperSize.printableHeightDots) {
                h1 = paperSize.printableHeightDots;
                s1 = h1 / height;
                w1 = s1 * width;
            }

            let w2 = paperSize.printableHeightDots;
            let s2 = w2 / width;
            let h2 = s2 * height;
            if (h2 > paperSize.printableWidthDots) {
                h2 = paperSize.printableWidthDots;
                s2 = h2 / height;
                w2 = s2 * width;
            }

            if (w1 >= w2) {
                this.doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [ paperSize.widthDots, paperSize.heightDots ],
                });
                this.doc.setCurrentTransformationMatrix(this.doc.Matrix(s1, 0, 0, s1, (paperSize.widthDots - w1) / 2,
                        paperSize.heightDots * (1 - s1) - (paperSize.heightDots - h1) / 2));
            } else {
                this.doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: [ paperSize.widthDots, paperSize.heightDots ],
                });
                this.doc.setCurrentTransformationMatrix(this.doc.Matrix(s2, 0, 0, s2, (paperSize.heightDots - w2) / 2,
                        paperSize.widthDots * (1 - s2) - (paperSize.widthDots - h2) / 2));
            }
        }

        this.doc.rect(0, 0, width, height, null);
        this.doc.clip();
        this.doc.discardPath();

        return this;
    }

    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer {
        this.doc.setLineCap(lineCap);
        this.doc.setLineWidth(lineWidth);
        this.doc.setGState(this.doc.GState({ 'stroke-opacity': color.alpha }));
        this.doc.setDrawColor(color.red, color.green, color.blue);
        return this;
    }

    setFill(color: Color): Renderer {
        super.setFill(color);
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.doc.setGState(this.doc.GState({ 'opacity': color.alpha }));
            this.doc.setFillColor(color.red, color.green, color.blue);
        }
        return this;
    }

    beginPath(): Renderer {
        this.doc.discardPath();
        this.x0 = 0;
        this.y0 = 0;
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.doc.rect(x, y, w, h, 'F');
            this.doc.discardPath();
        }
        return this;
    }

    moveTo(x: number, y: number): Renderer {
        this.doc.moveTo(x, y);
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    lineTo(x: number, y: number): Renderer {
        this.doc.lineTo(x, y);
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    curveTo(ax: number, ay: number, bx: number, by: number, x2: number, y2: number): Renderer {
        this.doc.curveTo(ax, ay, bx, by, x2, y2);
        return this;
    }

    stroke(): Renderer {
        this.doc.stroke();
        return this;
    }

    async toBlob(): Promise<Blob> {
        return Promise.resolve(this.doc.output('blob'));
    }
}