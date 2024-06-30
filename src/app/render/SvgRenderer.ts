import { StrokeData, SVG } from '@svgdotjs/svg.js';
import { Color, toHexCode } from 'src/types/Color';
import { Renderer } from './Renderer';

export class SvgRenderer implements Renderer {

    private svg = SVG().addTo('body');

    private x0 = 0;
    private y0 = 0;
    private path = '';
    private strokeData: StrokeData = { width: 1, color: '#000000FF'};
    private fillColor = '#FFFFFFFF';

    setSize(width: number, height: number): Renderer {
        this.svg.size(width, height);
        return this;
    }

    setStroke(linecap: string, lineWidth: number, color: Color): Renderer {
        this.strokeData = { linecap, width: lineWidth, color: toHexCode(color) };
        return this;
    }

    setFill(color: Color): Renderer {
        this.fillColor = toHexCode(color);
        return this;
    }

    fillRect(x: number, y: number, w: number, h: number): Renderer {
        this.svg.rect(w, h).move(x, y).fill(this.fillColor);
        return this;
    }

    beginPath(): Renderer {
        this.path = '';
        this.x0 = 0;
        this.y0 = 0;
        return this;
    }

    moveTo(x: number, y: number): Renderer {
        this.path += `M ${x} ${y} `;
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    lineTo(x: number, y: number): Renderer {
        this.path += `L ${x} ${y} `;
        this.x0 = x;
        this.y0 = y;
        return this;
    }

    // private isCollinear(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
    //     return Math.abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0))
    //             < 1E-6 * Math.abs(Math.max(x0, y0, x1, y1, x2, y2));
    // }

    private isClockwise(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
        return (x0 - x1) * (y2 - y1) - (y0 - y1) * (x2 - x1) < 0;
    }

    // private dist(x0: number, y0: number, x1: number, y1: number) {
    //     const dx = x1 - x0;
    //     const dy = y1 - y0;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }

    // arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Renderer {
    //     if (radius <= 0) {
    //         return this.lineTo(x1, y1).lineTo(x2, y2);
    //     }
    //     if ((this.x0 === x1 && this.y0 === y1) || (x1 === x2 && y1 === y2)
    //             || this.isCollinear(this.x0, this.y0, x1, y1, x2, y2)) {
    //         return this.lineTo(x2, y2);
    //     }
    //
    //     const sweep = this.isClockwise(this.x0, this.y0, x1, y1, x2, y1) ? 1 : 0;
    //
    //     const d02 = this.dist(this.x0, this.y0, x2, y2);
    //     const d01 = this.dist(this.x0, this.y0, x1, y1);
    //     const d12 = this.dist(x1, y1, x2, y2);
    //
    //     const ds = d02 + d01 + d12;
    //     const cx = (d12 * this.x0 + d02 * x1 + d01 * x2) / ds;
    //     const cy = (d12 * this.y0 + d02 * y1 + d01 * y2) / ds;
    //
    //     const px = (x1 + x2) / 2 + (d02 - d01) * (x1 - x2) / (2 * d12);
    //     const py = (y1 + y2) / 2 + (d02 - d01) * (y1 - y2) / (2 * d12);
    //
    //     const k = radius / this.dist(px, py, cx, cy);
    //     const dx = x1 + k * (px - x1);
    //     const dy = y1 + k * (py - y1);
    //
    //     this.path += `A ${radius} ${radius} 0 0 ${sweep} ${dx} ${dy}`;
    //
    //     this.x0 = x2;
    //     this.y0 = y2;
    //     return this;
    // }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Renderer {
        const sweep = this.isClockwise(this.x0, this.y0, x1, y1, x2, y1) ? 1 : 0;
        this.path += `A ${radius} ${radius} 0 0 ${sweep} ${(x1 + x2) / 2} ${(y1 + y2) / 2}`;

        this.x0 = x2;
        this.y0 = y2;
        return this;
    }

    stroke(): Renderer {
        this.svg.path(this.path).fill('none').stroke(this.strokeData);
        return this;
    }

    toBlob(): Blob {
        return new Blob([this.svg.svg()], { type: 'image/svg+xml;charset=utf-8' });
    }
}