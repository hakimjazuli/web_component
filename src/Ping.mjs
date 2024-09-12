// @ts-check

import { Ping as Ping_ } from '@html_first/simple_signal';
import { spaHelper } from './spaHelper.mjs';

/**
 * - trigger based callback integrated to the internal queue handler;
 */
export class Ping extends Ping_ {
	/**
	 * use for handling out of scoped runtime, like:
	 * - `Ping` asyncCallback;
	 * - `eventListeners`;
	 * @param {{
	 * documentScope:import('@html_first/simple_signal').documentScope,
	 * scopedCallback:()=>Promise<void>
	 * }} options
	 * @returns {Ping}
	 */
	static scoped = ({ documentScope, scopedCallback }) =>
		new Ping(async () => {
			const currentScope = spaHelper.currentDocumentScope;
			spaHelper.currentDocumentScope = documentScope;
			await scopedCallback();
			spaHelper.currentDocumentScope = currentScope;
		});
}
