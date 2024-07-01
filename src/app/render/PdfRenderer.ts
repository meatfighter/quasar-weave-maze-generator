import { jsPDF } from "jspdf";
import { Renderer } from 'src/app/render/Renderer';
import { Color, toHexCode } from 'src/types/Color';
import { CurveRenderer } from 'src/app/render/CurveRenderer';

export class PdfRenderer extends CurveRenderer {

    doc = new jsPDF();

    setSize(width: number, height: number): Renderer {
        this.doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [ width, height ],
        });
        return this;
    }

    setStroke(linecap: string, lineWidth: number, color: Color): Renderer {
        this.doc.setLineCap(linecap);
        this.doc.setLineWidth(lineWidth);
        this.doc.setDrawColor(toHexCode(color));
        return this;
    }

    setFill(color: Color): Renderer {
        return this;
    }

    beginPath(): Renderer {
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
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

    toBlob(): Blob {
        return undefined;
    }

}