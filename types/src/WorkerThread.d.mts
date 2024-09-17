/**
 * @description
 * helper class to define web worker thread;
 * ```js
 *	new WorkerThread({
 *		onMessage: ({ event, postMessage }) => {
 *			const message = undefined;
 *			// code to handle the message
 *			postMessage(message);
 *		},
 *	});
 * ```
 */
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
}
