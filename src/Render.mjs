// @ts-check

import { WebComponent } from './WebComponent.mjs';
import { QueryRouter } from './QueryRouter.mjs';

/**
 * Render Helper to `document.body`
 */
export class Render {
	/**
	 * render string to element.innerHTML that fit `#id` selector
	 * @param {{
	 * idName:string,
	 * rootComponent:WebComponent,
	 * useSPARouter?:boolean,
	 * globalStyle_?:string,
	 * }} options
	 */
	constructor({ idName, rootComponent, useSPARouter = false, globalStyle_ = undefined }) {
		if (globalStyle_) {
			WebComponent.globalStyle = globalStyle_;
		}
		window.addEventListener('load', () => {
			const app = document.body.querySelector(`#${idName}`);
			if (!app) {
				console.warn({
					idName,
					problem: `#${idName} is not exist in document.body`,
				});
				return;
			}
			app.innerHTML = rootComponent.tag().string;
			if (useSPARouter) {
				new QueryRouter();
			}
		});
	}
}
