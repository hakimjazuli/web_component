// @ts-check

import { WebComponent } from './WebComponent.mjs';

/**
 * @description
 * class helper to render `ReturnType<WebComponent["tag"]>` `document.body`:
 * - why `ReturnType<WebComponent["tag"]>` instead of instance of `WebComponent`, `static tag` have functionality to modify options(like props value);
 * - so you can edit the `tag` option without changing the default behaviour of the `Root Component`;
 */
export class App {
	/**
	 * render string to element.innerHTML that fit `#id` selector
	 * - `Define`-prefixed options: serves no purposes other than to make sure for js runtime to statically imports the respective instance before `App` instantiation;
	 * @param {Object} options
	 * @param {string} options.idName
	 * @param {ReturnType<WebComponent["tag"]>} options.rootComponent
	 * @param {string} [options.globalStyle_]
	 * @param {import("./DefineQRouter.mjs").DefineQRouter} [options.DefineQRouter]
	 * @param {import("./DefineStorage.mjs").DefineStorage} [options.DefineStorage]
	 * @param {import("./DefineShortCuts.mjs").DefineShortCuts} [options.DefineShortCuts]
	 */
	constructor({
		idName,
		rootComponent,
		globalStyle_ = undefined,
		DefineQRouter = undefined,
		DefineStorage = undefined,
		DefineShortCuts = undefined,
	}) {
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
			app.innerHTML = rootComponent.string;
		});
	}
}
