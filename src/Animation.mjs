// @ts-check

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
	static animationLinier = ({
		callback,
		framePerSecond = 24,
		totalFrame = 24,
		totalSecond = 1,
	}) => {
		const totalFrames = Math.min(totalFrame, framePerSecond * totalSecond);
		const frameInterval = 1000 / framePerSecond;
		let frameNumber = 0;
		let startTime = performance.now();
		const nextFrame = () => {
			const currentTime = performance.now();
			const elapsedTimeMs = currentTime - startTime;
			frameNumber = Math.floor(elapsedTimeMs / frameInterval);
			if (frameNumber >= totalFrames) {
				frameNumber = totalFrames;
			}
			const framePercent = (frameNumber / totalFrames) * 100;
			if (callback) {
				callback({ frameNumber, framePercent, elapsedTimeMs });
			}
			if (frameNumber < totalFrames) {
				requestAnimationFrame(nextFrame);
			}
		};
		nextFrame();
	};
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
	static bezierControlPoint = (x1, y1, x2, y2) => {
		return [
			{ x: 0, y: 0 },
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: 1, y: 1 },
		];
	};
	static easeIn = Animation.bezierControlPoint(0.42, 0, 1, 1);
	static easeOut = Animation.bezierControlPoint(0, 0, 0.58, 1);
	static easeInOut = Animation.bezierControlPoint(0.42, 0, 0.58, 1);
	static easeOutBounce = Animation.bezierControlPoint(0.68, -0.55, 0.27, 1.55);
	static easeInCirc = Animation.bezierControlPoint(0.6, 0.04, 0.98, 0.34);
	static easeOutCirc = Animation.bezierControlPoint(0.06, 0.82, 0.35, 1);
	static easeInOutCirc = Animation.bezierControlPoint(0.78, 0.14, 0.15, 0.86);
	/**
	 * Calls a callback function for each frame using a cubic Bezier curve for animation timing.
	 * @param {BezierOptions} options - The options to control the animation.
	 */
	static animationCubicBezier = ({
		framePerSecond = 24,
		totalFrame = 24,
		totalSecond = 1,
		controlPoints,
		callback,
	}) => {
		const totalFrames = Math.min(totalFrame, framePerSecond * totalSecond);
		const frameInterval = 1000 / framePerSecond;
		let frameNumber = 0;
		let startTime = performance.now();
		if (controlPoints.length !== 4) {
			throw new Error('Control points must be an array with 4 points.');
		}
		const [P1, P2] = controlPoints;
		/**
		 * @typedef {Object} ControlPoint
		 * @property {number} x - The x-coordinate of the control point (ranges from 0 to 1).
		 * @property {number} y - The y-coordinate of the control point (ranges from 0 to 1).
		 */
		/**
		 * Calculates the cubic Bezier curve value at a given time t.
		 * @param {number} t - The time parameter (ranges from 0 to 1).
		 * @param {ControlPoint} P0 - The start point of the curve.
		 * @param {ControlPoint} P1 - The first control point.
		 * @param {ControlPoint} P2 - The second control point.
		 * @param {ControlPoint} P3 - The end point of the curve.
		 * @returns {number} - The y value of the Bezier curve at time t.
		 */
		const cubicBezier = (t, P0, P1, P2, P3) => {
			const u = 1 - t;
			return u ** 3 * P0.y + 3 * u ** 2 * t * P1.y + 3 * u * t ** 2 * P2.y + t ** 3 * P3.y;
		};
		const nextFrame = () => {
			const now = performance.now();
			const elapsedTimeMs = now - startTime;
			const elapsedPercent = elapsedTimeMs / (totalFrames * frameInterval);
			const t = Math.min(elapsedPercent, 1);
			const bezierPercent = cubicBezier(t, { x: 0, y: 0 }, P1, P2, { x: 1, y: 1 }) * 100;
			while (
				frameNumber <= Math.floor(elapsedPercent * totalFrames) &&
				frameNumber < totalFrames
			) {
				callback({
					frameNumber,
					framePercent: bezierPercent,
					elapsedTimeMs,
				});
				frameNumber++;
			}
			if (frameNumber < totalFrames) {
				const nextInterval = frameInterval - (performance.now() - now);
				setTimeout(nextFrame, Math.max(0, nextInterval));
			}
		};
		nextFrame();
	};
}
