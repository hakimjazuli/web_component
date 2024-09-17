// @ts-check

import { Ping } from './Ping.mjs';
import { spaHelper } from './spaHelper.mjs';

/**
 * @description
 * create shortcut through class instantiation;
 * - register by putting it in the instantiation of [App](#app)
 */
/**
 * @template {{
 * [shortcutName:string]:{
 * action:(key:KeyboardEvent)=>boolean,
 * asyncCallback:()=>Promise<void>,
 * }
 * }} namedShortCut
 * @template {Extract<keyof namedShortCut, string>} ShortCutName
 */
export class DefineShortCuts {
	/**
	 * @type {DefineShortCuts}
	 */
	static __;
	/**
	 * @param {namedShortCut} shortcutList
	 */
	constructor(shortcutList) {
		if (DefineShortCuts.__ instanceof DefineShortCuts) {
			spaHelper.warningSingleton(DefineShortCuts);
			return;
		}
		DefineShortCuts.__ = this;
		// @ts-ignore
		this.pings = {};
		for (const namedShorCut in shortcutList) {
			const ping = (this.pings[namedShorCut.toString()] = Ping.unScopedOnCall(
				shortcutList[namedShorCut].asyncCallback
			));
			window.addEventListener('keydown', (event) => {
				if (!shortcutList[namedShorCut].action(event)) {
					return;
				}
				ping();
			});
		}
	}
	/**
	 * @type {Record.<ShortCutName, Ping["ping"]>}
	 */
	pings;
}
