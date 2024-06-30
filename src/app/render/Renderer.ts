import { Color } from 'src/types/Color';

export interface Renderer {
    setSize(width: number, height: number): Renderer;
    setStroke(linecap: string, lineWidth: number, color: Color): Renderer;
    setFill(color: Color): Renderer;
    fillRect(x: number, y: number, w: number, h: number): Renderer;
    beginPath(): Renderer;
    moveTo(x: number, y: number): Renderer;
    lineTo(x: number, y: number): Renderer;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Renderer;
    stroke(): Renderer;
    toBlob(): Blob;
}