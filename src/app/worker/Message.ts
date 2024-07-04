import { MessageType } from 'src/app/worker/MessageType';

export class Message<T> {
    constructor(public type: MessageType, public data?: T) {
    }
}