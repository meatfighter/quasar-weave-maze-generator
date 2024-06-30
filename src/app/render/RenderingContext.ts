import { Color } from '@/app/render/Color';

export interface RenderingContext {
    setStroke(lineWidth: number, color: Color): void;
    setFill(color: Color): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    beginPath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    stroke(): void;
}