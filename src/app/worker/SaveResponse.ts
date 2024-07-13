export class SaveResponse {
    constructor(public readonly id: number,
                public readonly filename: string,
                public readonly url: string) {
    }
}