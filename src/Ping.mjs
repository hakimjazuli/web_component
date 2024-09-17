// @ts-check

import { Ping as Ping_ } from '@html_first/simple_signal';
import { spaHelper } from './spaHelper.mjs';

/**
 * @description
 * trigger based callback integrated to the internal library  queue handler;
 * can be created using:
 * - class instantiation;
 * - static method calls (documented internally, just hit ctrl+space and you are good);
 * standard behaviour:
 * - asyncCallback will be called upon declaration (except static method `unScopedOnCall`);
 * - you can opt out by returning early
 * ```js
 * const pingExample = new Ping(async(first)=>{ // or static method
 *		if (first) {
 *			return;
 *		}
 * })
 * // pingExample.ping(); // to call it later
 * ```
 */
export class Ping extends Ping_ {
	/**
	 * @typedef {Object} manualScopeOptions
	 * @property {import('@html_first/simple_signal').documentScope} documentScope
	 * @property {()=>Promise<void>} scopedCallback
	 * @property {boolean} runCheckAtFirst
	 */
	/**
	 * manual scoping for lib internal functionality
	 * @param {manualScopeOptions} options
	 * @returns {Ping["ping"]}
	 */
	static manualScope = ({ documentScope, scopedCallback, runCheckAtFirst }) => {
		return new Ping(async (first) => {
			if (first && !runCheckAtFirst) {
				return;
			}
			const currentScope = spaHelper.currentDocumentScope;
			spaHelper.currentDocumentScope = documentScope;
			await scopedCallback();
			spaHelper.currentDocumentScope = currentScope;
		}).ping;
	};
	/**
	 * @typedef {Object} autoScopeOptions
	 * @property {()=>Promise<void>} scopedCallback
	 * @property {boolean} runCheckAtFirst
	 */
	/**
	 * use for handling out of scoped codeblock:
	 * @param {autoScopeOptions} options
	 * @return {Ping["ping"]}
	 */
	static autoScope = ({ scopedCallback, runCheckAtFirst }) => {
		const documentScope = spaHelper.currentDocumentScope;
		return Ping.manualScope({
			documentScope,
			scopedCallback,
			runCheckAtFirst,
		});
	};
	/**
	 * - unscoped ping
	 * - callback will be called when returned function is called
	 * @param {()=>Promise<void>} asyncCallback
	 * @return {Ping["ping"]}
	 */
	static unScopedOnCall = (asyncCallback) => {
		return new Ping(async (first) => {
			if (first) {
				return;
			}
			await asyncCallback();
		}).ping;
	};
}
