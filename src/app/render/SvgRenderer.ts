import { StrokeData, SVG } from '@svgdotjs/svg.js';
import { Color, toHexCode } from 'src/types/Color';
import { Renderer } from './Renderer';
import { eq } from 'src/app/render/Point';

export class SvgRenderer implements Renderer {

    private readonly K = 4 * (Math.sqrt(2) - 1) / 3;

    private svg = SVG();

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

    arcTo(x1: number, _y1: number, x2: number, y2: number, radius: number): Renderer {

        const kRadius = this.K * radius;

        let ax: number;
        let ay: number;
        let bx: number;
        let by: number;
        if (eq(x1, x2)) {
            if (this.x0 < x2) {
                if (y2 < this.y0) {
                    ax = this.x0 + kRadius;
                    ay = y2 + radius;
                    bx = this.x0 + radius;
                    by = y2 + kRadius;
                } else {
                    ax = this.x0 + kRadius;
                    ay = y2 - radius;
                    bx = this.x0 + radius;
                    by = y2 - kRadius;
                }
            } else {
                if (y2 < this.y0) {
                    ax = this.x0 - kRadius;
                    ay = y2 + radius;
                    bx = this.x0 - radius;
                    by = y2 + kRadius;
                } else {
                    ax = this.x0 - kRadius;
                    ay = y2 - radius;
                    bx = this.x0 - radius;
                    by = y2 - kRadius;
                }
            }
        } else {
            if (this.y0 < y2) {
                if (x2 < this.x0) {
                    ax = x2 + radius;
                    ay = this.y0 + kRadius;
                    bx = x2 + kRadius;
                    by = this.y0 + radius;
                } else {
                    ax = x2 - radius;
                    ay = this.y0 + kRadius;
                    bx = x2 - kRadius;
                    by = this.y0 + radius;
                }
            } else {
                if (x2 < this.x0) {
                    ax = x2 + radius;
                    ay = this.y0 - kRadius;
                    bx = x2 + kRadius;
                    by = this.y0 - radius;
                } else {
                    ax = x2 - radius;
                    ay = this.y0 - kRadius;
                    bx = x2 - kRadius;
                    by = this.y0 - radius;
                }
            }
        }

        this.path += `C ${ax} ${ay} ${bx} ${by} ${x2} ${y2} `;

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