export class WorkerThread {
    /**
     * @typedef {Object} optionsOnMessage
     * @property {MessageEvent} event
     * @property {(message:any)=>void} postMessage
     */
    /**
     * Creates a worker thread with provided handlers.
     * @param {Object} options - Configuration options for the worker thread.
     * @param {(options:optionsOnMessage) => void} options.onMessage - A callback function to handle incoming messages in the worker thread.
     */
    constructor({ onMessage }: {
        onMessage: (options: {
            event: MessageEvent;
            postMessage: (message: any) => void;
        }) => void;
    });
    /**
     * @type {(message: any) => void}
     */
    postMessage: (message: any) => void;
}
