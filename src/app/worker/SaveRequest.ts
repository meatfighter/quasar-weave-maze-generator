import { SaveOptions } from 'src/app/save/SaveOptions';
import { RenderOptions } from 'src/app/render/RenderOptions';

export class SaveRequest {
    constructor(public readonly renderOptions: RenderOptions,
                public readonly saveOptions: SaveOptions) {
    }
}