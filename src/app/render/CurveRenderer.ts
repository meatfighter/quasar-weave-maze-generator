import { Renderer } from 'src/app/render/Renderer';
import { Color } from 'src/types/Color';
import { eq } from 'src/app/render/Point';

export abstract class CurveRenderer implements Renderer {

    abstract beginPath(): Renderer;
    abstract fillRect(x: number, y: number, w: number, h: number): Renderer;
    abstract lineTo(x: number, y: number): Renderer;
    abstract moveTo(x: number, y: number): Renderer;
    abstract setFill(color: Color): Renderer;
    abstract setSize(width: number, height: number): Renderer;
    abstract setStroke(linecap: string, lineWidth: number, color: Color): Renderer;
    abstract stroke(): Renderer;
    abstract toBlob(): Promise<Blob>;

    // https://spencermortensen.com/articles/bezier-circle/
    private readonly K = 0.5519150244935106;

    protected x0 = 0;
    protected y0 = 0;

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

        this.curveTo(ax, ay, bx, by, x2, y2);

        this.x0 = x2;
        this.y0 = y2;
        return this;
    }

    abstract curveTo(ax: number, ay: number, bx: number, by: number, x2: number, y2: number): void;
}