import { Color } from 'src/app/color/Color';
import { PaperSize } from 'src/app/render/PaperSize';

export interface Renderer {
    setSize(width: number, height: number, paperSize?: PaperSize): Renderer;
    setStroke(lineCap: string, lineWidth: number, color: Color): Renderer;
    setFill(color: Color): Renderer;
    fillRect(x: number, y: number, w: number, h: number): Renderer;
    beginPath(): Renderer;
    moveTo(x: number, y: number): Renderer;
    lineTo(x: number, y: number): Renderer;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Renderer;
    stroke(): Renderer;
    toBlob(): Promise<Blob>;
}

export interface RendererConstructor {
    new (ignoreWhiteFill: boolean): Renderer;
}

export function createRenderer(ctor: RendererConstructor, ignoreWhiteFill: boolean) {
    return new ctor(ignoreWhiteFill);
}