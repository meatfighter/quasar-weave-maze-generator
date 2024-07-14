import { PrintOptions } from 'src/app/file/PrintOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';

export class PrintRequest {
    constructor(public readonly renderOptions: RenderOptions,
                public readonly printOptions: PrintOptions) {
    }
}