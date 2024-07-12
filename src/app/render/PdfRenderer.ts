import { jsPDF } from 'jspdf';
import { Renderer } from 'src/app/render/Renderer';
import { Color, toHexCode } from 'src/app/color/Color';
import { CurveRenderer } from 'src/app/render/CurveRenderer';

export class PdfRenderer extends CurveRenderer {

    private doc = new jsPDF();

    setSize(width: number, height: number): Renderer {
        this.doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [ width, height ],
        });
        return this;
    }

    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer {
        this.doc.setLineCap(lineCap);
        this.doc.setLineWidth(lineWidth);
        this.doc.setDrawColor(toHexCode(color));
        return this;
    }

    setFill(color: Color): Renderer {
        this.doc.setFillColor(toHexCode(color));
        return this;
    }

    beginPath(): Renderer {
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        this.doc.rect(x, y, w, h, 'F');
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