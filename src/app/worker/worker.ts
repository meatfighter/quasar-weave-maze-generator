import { Message } from './Message';
import { MessageType } from 'src/app/worker/MessageType';
import { CancelState } from 'src/app/worker/CancelState';
import { yieldToEventThread } from 'src/utils/threads';
import { generateMaze } from 'src/app/maze/maze-generator';
import { renderMaze } from 'src/app/render/maze-renderer';
import { MazeResponse } from 'src/app/maze/MazeResponse';
import { RenderResponse } from 'src/app/render/RenderResponse';
import { GenerateAndRenderMazeRequest } from 'src/app/worker/GenerateAndRenderMazeRequest';
import { Maze } from 'src/app/maze/Maze';
import { MazeOptions } from 'src/app/maze/MazeOptions';

let generateAndRenderMazeCancelState = new CancelState();
let maze = new Maze(new MazeOptions(1, 1, 0, 0, false));

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    console.log(`message: ${message}`);
    switch (message.type) {
        case MessageType.GENERATE_AND_RENDER_MAZE:
            onGenerateAndRenderMaze(message.data as GenerateAndRenderMazeRequest);
            break;
        case MessageType.RENDER_MAZE:
            void onRenderMaze(message.data as RenderMazeTask);
            break;
        case MessageType.CANCEL:
            onCancel(message.data as string);
            break;
    }
};


function onGenerateAndRenderMaze(request: GenerateAndRenderMazeRequest) {
    if (generateAndRenderMazeCancelState) {
        generateAndRenderMazeCancelState.cancelled = true;
    }
    const cancelState = new CancelState();
    generateAndRenderMazeCancelState = cancelState;
    generateMaze(request.mazeOptions, cancelState)
            .then(_maze => {
                if (_maze && !cancelState.cancelled) {
                    maze = _maze;
                    return renderMaze(_maze, request.renderOptions, cancelState);
                } else {
                    return null;
                }
            }).then(blob => {
                if (blob && !cancelState.cancelled) {
                    
                }
            });
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