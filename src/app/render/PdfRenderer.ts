import { jsPDF } from 'jspdf';
import { Renderer } from 'src/app/render/Renderer';
import { Color, toHexCode } from 'src/app/color/Color';
import { CurveRenderer } from 'src/app/render/CurveRenderer';
import { PaperSize } from 'src/app/render/PaperSize';

export class PdfRenderer extends CurveRenderer {

    private doc = new jsPDF();

    constructor(ignoreWhiteFill: boolean) {
        super(ignoreWhiteFill);
    }

    setSize(width: number, height: number, paperSize: PaperSize): Renderer {
        if (paperSize === PaperSize.FIT) {
            this.doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [ width, height ],
            });
        } else {
            this.doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [ paperSize.widthDots, paperSize.heightDots ],
            });
            let w = paperSize.printableWidthDots;
            let scale = w / width;
            let h = scale * height;
            if (h > paperSize.printableHeightDots) {
                h = paperSize.printableHeightDots;
                scale = h / height;
                w = scale * width;
            }
            this.doc.setCurrentTransformationMatrix(this.doc.Matrix(scale, 0, 0, scale, (paperSize.widthDots - w) / 2,
                    (paperSize.heightDots - h) / 2));
        }

        return this;
    }

    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer {
        this.doc.setLineCap(lineCap);
        this.doc.setLineWidth(lineWidth);
        this.doc.setDrawColor(toHexCode(color));
        return this;
    }

    setFill(color: Color): Renderer {
        super.setFill(color);
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.doc.setFillColor(toHexCode(color));
        }
        return this;
    }

    beginPath(): Renderer {
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.doc.rect(x, y, w, h, 'F');
        }
        return this;
    }

    moveTo(x: number, y: number): Renderer {
        this.doc.moveTo(x, y);
        return this;
    }

    lineTo(x: number, y: number): Renderer {
        this.doc.lineTo(x, y);
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