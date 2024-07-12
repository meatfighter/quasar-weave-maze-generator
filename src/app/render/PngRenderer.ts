import { Renderer } from 'src/app/render/Renderer';
import { Color, toRgba } from 'src/app/color/Color';

export class PngRenderer implements Renderer {

    private canvas = new OffscreenCanvas(1, 1);
    private ctx = this.canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    setSize(width: number, height: number): Renderer {
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
        return this;
    }

    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer {
        this.ctx.lineCap = lineCap as CanvasLineCap;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = toRgba(color);
        return this;
    }

    setFill(color: Color): Renderer {
        this.ctx.fillStyle = toRgba(color);
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        this.ctx.fillRect(x, y, w, h);
        return this;
    }

    beginPath(): Renderer {
        this.ctx.beginPath();
        return this;
    }

    moveTo(x: number, y: number): Renderer {
        this.ctx.moveTo(x, y);
        return this;
    }

    lineTo(x: number, y: number): Renderer {
        this.ctx.lineTo(x, y);
        return this;
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Renderer {
        this.ctx.arcTo(x1, y1, x2, y2, radius);
        return this;
    }

    stroke(): Renderer {
        this.ctx.stroke();
        return this;
    }

    async toBlob(): Promise<Blob> {
        return this.canvas.convertToBlob();
    }
}