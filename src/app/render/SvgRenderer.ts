import { Color, toRgb } from 'src/app/color/Color';
import { Renderer } from 'src/app/render/Renderer';
import { CurveRenderer } from 'src/app/render/CurveRenderer';

export class SvgRenderer extends CurveRenderer {

    private svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
    private strokeStr = '';
    private fillStr = '';
    private pathStr = '';

    constructor(ignoreWhiteFill: boolean) {
        super(ignoreWhiteFill);
    }

    setSize(width: number, height: number): Renderer {
        // eslint-disable-next-line quotes
        this.svg += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `
                + `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
        return this;
    }

    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer {
        this.strokeStr = `fill="none" stroke-width="${lineWidth}" stroke-linecap="${lineCap}" stroke-linejoin="miter" `
                + `stroke="${toRgb(color)}" stroke-opacity="${color.alpha}" stroke-miterlimit="10"`;
        return this;
    }

    setFill(color: Color): Renderer {
        super.setFill(color);
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.fillStr = `fill="${toRgb(color)}" fill-opacity="${color.alpha}"`;
        }
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        if (!(this.ignoreWhiteFill && this.whiteFill)) {
            this.svg += `<rect x="${x - w / 10}" y="${y - h / 10}" width="${1.2 * w}" height="${1.2 * h}" `
                    + `${this.fillStr}/>\n`;
        }
        return this;
    }

    beginPath(): Renderer {
        this.x0 = 0;
        this.y0 = 0;
        this.pathStr = '';
        return this;
    }

    moveTo(x: number, y: number): Renderer {
        this.pathStr += `M ${x} ${y} `;
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    lineTo(x: number, y: number): Renderer {
        this.pathStr += `L ${x} ${y} `;
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    curveTo(ax: number, ay: number, bx: number, by: number, x2: number, y2: number): Renderer {
        this.pathStr += `C ${ax} ${ay} ${bx} ${by} ${x2} ${y2} `;
        return this;
    }

    stroke(): Renderer {
        this.svg += `<path ${this.strokeStr} d="${this.pathStr}"/>\n`;
        this.pathStr = '';
        return this;
    }

    async toBlob(): Promise<Blob> {
        this.svg += '</svg>\n';
        return Promise.resolve(new Blob([this.svg], { type: 'image/svg+xml;charset=utf-8' }));
    }
}