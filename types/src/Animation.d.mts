export class Animation {
    /**
     * @typedef {Object} Options
     * @property {number} [framePerSecond] - Frames per second.
     * @property {number} [totalFrame] - Total number of frames.
     * @property {number} [totalSecond] - Total duration in seconds.
     */
    /**
     * Generates cubic Bezier control points for the animation.
     * @param {number} x1 - The x-coordinate of the first control point.
     * @param {number} y1 - The y-coordinate of the first control point.
     * @param {number} x2 - The x-coordinate of the second control point.
     * @param {number} y2 - The y-coordinate of the second control point.
     * @returns {{x:number,y:number}[]}
     */
    static bezierControlPoint: (x1: number, y1: number, x2: number, y2: number) => {
        x: number;
        y: number;
    }[];
    static easeIn: {
        x: number;
        y: number;
    }[];
    static easeOut: {
        x: number;
        y: number;
    }[];
    static easeInOut: {
        x: number;
        y: number;
    }[];
    static easeOutBounce: {
        x: number;
        y: number;
    }[];
    static easeInCirc: {
        x: number;
        y: number;
    }[];
    static easeOutCirc: {
        x: number;
        y: number;
    }[];
    static easeInOutCirc: {
        x: number;
        y: number;
    }[];
    /**
     * @typedef {Object} bezierCallbackOption
     * @property {number} frameNumber
     * @property {number} framePercent
     * @property {number} elapsedTimeMs
     */
    /**
     * Calls a callback function for each frame using a cubic Bezier curve for animation timing.
     * @param {Options} options - The options to control the animation.
     * @param {ReturnType<typeof Animation.bezierControlPoint>} controlPoints - Control points for the cubic Bezier curve.
     * Must be an array with exactly 4 points (start, two control points, end).
     * @param {(options:bezierCallbackOption)=>void} callback - The callback function to call each frame. Receives frame details.
     */
    static bezier: ({ framePerSecond, totalFrame, totalSecond }: {
        /**
         * - Frames per second.
         */
        framePerSecond?: number;
        /**
         * - Total number of frames.
         */
        totalFrame?: number;
        /**
         * - Total duration in seconds.
         */
        totalSecond?: number;
    }, controlPoints: ReturnType<typeof Animation.bezierControlPoint>, callback: (options: {
        frameNumber: number;
        framePercent: number;
        elapsedTimeMs: number;
    }) => void) => void;
}
