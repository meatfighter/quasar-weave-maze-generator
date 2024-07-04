import { yieldToEventThread } from 'src/utils/threads';

export interface Task {
    yieldCounter: number;
    cancelled: boolean;
    readonly id: string;
}

export const ITERATIONS_PER_YIELD = 256;

export async function isCancelled(task: Task): Promise<boolean> {
    if (--task.yieldCounter <= 0) {
        task.yieldCounter = ITERATIONS_PER_YIELD;
        await yieldToEventThread();
    }
    return task.cancelled;
}