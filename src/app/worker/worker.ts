import { Message } from './Message';
import { MessageType } from 'src/app/worker/MessageType';
import { Task } from 'src/app/worker/Task';
import { GenerateMazeTask } from 'src/app/maze/GenerateMazeTask';
import { yieldToEventThread } from 'src/utils/threads';
import { generateMaze } from 'src/app/maze/maze-generator';
import { RenderMazeTask } from 'src/app/render/RenderMazeTask';
import { renderMaze } from 'src/app/render/maze-renderer';
import { MazeResponse } from 'src/app/maze/MazeResponse';
import { RenderResponse } from 'src/app/render/RenderResponse';

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.GENERATE_MAZE:
            void onGenerateMaze(message.data as GenerateMazeTask);
            break;
        case MessageType.RENDER_MAZE:
            void onRenderMaze(message.data as RenderMazeTask);
            break;
        case MessageType.CANCEL:
            onCancel(message.data as string);
            break;
    }
};

const tasks = new Map<string, Task>();

async function onGenerateMaze(task: GenerateMazeTask) {
    console.log('--1');
    try {
        tasks.set(task.id, task);
        await yieldToEventThread();
        if (task.cancelled) {
            return;
        }

        const maze = await generateMaze(task);

        await yieldToEventThread();
        if (task.cancelled) {
            return;
        }

        self.postMessage(new Message(MessageType.MAZE, new MazeResponse(task.id, maze)));
        console.log('--1a');
    } finally {
        tasks.delete(task.id);
    }
}

async function onRenderMaze(task: RenderMazeTask) {
    console.log('--2');
    try {
        tasks.set(task.id, task);
        await yieldToEventThread();
        if (task.cancelled) {
            return;
        }

        const blob = await renderMaze(task);

        await yieldToEventThread();
        if (task.cancelled) {
            return;
        }

        self.postMessage(new Message(MessageType.RENDER, new RenderResponse(task.id, URL.createObjectURL(blob))));
    } finally {
        tasks.delete(task.id);
    }
}

function onCancel(id: string) {
    const task = tasks.get(id);
    if (task) {
        task.cancelled = true;
    }
}

export {}