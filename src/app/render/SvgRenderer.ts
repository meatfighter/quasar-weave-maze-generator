import { StrokeData, SVG } from '@svgdotjs/svg.js';
import { Color, toHexCode } from 'src/types/Color';
import { Renderer } from './Renderer';
import { CurveRenderer } from 'src/app/render/CurveRenderer';

export class SvgRenderer extends CurveRenderer {

    private svg = SVG();

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

    curveTo(ax: number, ay: number, bx: number, by: number, x2: number, y2: number): Renderer {
        this.path += `C ${ax} ${ay} ${bx} ${by} ${x2} ${y2} `;
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