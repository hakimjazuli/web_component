/**
 * @description
 * collections of static methods helper for animation;
 * static method prefixed with `animation` can be used to generate recuring frame,
 * which in turn can be used in the callback to animate stuffs
 */
export class Animation {
    /**
     * @typedef {Object} callbackOptions
     * @property {number} frameNumber
     * @property {number} framePercent
     * @property {number} elapsedTimeMs
     */
    /**
     * @param {Object} options
     * @param {(options:callbackOptions)=>void} [options.callback]
     * @param {number} [options.framePerSecond]
     * @param {number} [options.totalFrame]
     * - whichever smaller from `totalSecond` and `totalFrame` will be used
     * @param {number} [options.totalSecond]
     * - whichever smaller from `totalSecond` and `totalFrame` will be used
     */
    static animationLinier: ({ callback, framePerSecond, totalFrame, totalSecond, }: {
        callback?: (options: {
            frameNumber: number;
            framePercent: number;
            elapsedTimeMs: number;
        }) => void;
        framePerSecond?: number;
        totalFrame?: number;
        totalSecond?: number;
    }) => void;
    /**
     * @typedef {Object} BezierOptions
     * @property {number} [framePerSecond] - Frames per second.
     * @property {number} [totalFrame] - Total number of frames.
     * - whichever smaller from `totalSecond` and `totalFrame` will be used
     * @property {number} [totalSecond] - Total duration in seconds.
     * - whichever smaller from `totalSecond` and `totalFrame` will be used
     * @property {ReturnType<typeof Animation.bezierControlPoint>} controlPoints - Control points for the cubic Bezier curve.
     * Must be an array with exactly 4 points (start, two control points, end).
     * @property {(options:callbackOptions)=>void} callback - The callback function to call each frame. Receives frame details.
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
     * Calls a callback function for each frame using a cubic Bezier curve for animation timing.
     * @param {BezierOptions} options - The options to control the animation.
     */
    static animationCubicBezier: ({ framePerSecond, totalFrame, totalSecond, controlPoints, callback, }: {
        /**
         * - Frames per second.
         */
        framePerSecond?: number;
        /**
         * - Total number of frames.
         * - whichever smaller from `totalSecond` and `totalFrame` will be used
         */
        totalFrame?: number;
        /**
         * - Total duration in seconds.
         * - whichever smaller from `totalSecond` and `totalFrame` will be used
         */
        totalSecond?: number;
        /**
         * - Control points for the cubic Bezier curve.
         * Must be an array with exactly 4 points (start, two control points, end).
         */
        controlPoints: ReturnType<typeof Animation.bezierControlPoint>;
        /**
         * - The callback function to call each frame. Receives frame details.
         */
        callback: (options: {
            frameNumber: number;
            framePercent: number;
            elapsedTimeMs: number;
        }) => void;
    }) => void;
}
