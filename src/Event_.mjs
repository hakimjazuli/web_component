// @ts-check

import { Ping } from './Ping.mjs';
import { spaHelper } from './spaHelper.mjs';

/**
 * @description
 * `eventListener` helper to create `autoqueued`-`autocsoped` callback;
 * ```js
 * // @ts-check
 * someObject.addEventListener('click', Event_.listener( (event) => {
 * // code
 * }))
 * ```
 * - why?
 * > - well, our `signal` based reactivity is all `autoscoped` on `WebComponent ShadowRoot`, but with event handler, it will be out of scoped;
 * > - with this static method, you can safely instantiated our `signal`
 */
export class Event_ {
	/**
	 * @param {(event:Event)=>Promise<any>} scopedCallback
	 */
	static listener = (scopedCallback) => {
		const documentScope = spaHelper.currentDocumentScope;
		/**
		 * @param {Event} event
		 */
		return (event) => {
			Ping.manualScope({
				documentScope,
				scopedCallback: () => scopedCallback(event),
				runCheckAtFirst: true,
			});
		};
	};
}
