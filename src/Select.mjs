// @ts-check

/**
 * @description
 * select element based on their binded `signal` attribute
 * ```js
 * // in WebComponent scope
 * const componentExample = new WebComponent({
 * 	lifecycle: ({ shadowRoot }) => {
 * 		const letExample = new Let('test');
 * 		return {
 * 			htmlTemplate: htmlLiteral`<div ${letExample.attr}></div>`,
 * 			connectedCallback: () => {
 * 				new Select(letExample, shadowRoot).handle(...handleArgs);
 * 			},
 * 		};
 * 	},
 * });
 * ```
 */
export class Select {
	/**
	 * @param {{attr:string}} letInstance
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 */
	constructor(letInstance, documentScope) {
		this.element = documentScope.querySelector(`[${letInstance.attr}]`);
	}
	/**
	 * @param {(HTMLElement:HTMLElement)=>void} callback
	 * @param {boolean} [handleEvenWhenFalsy]
	 * - true: for checking purposes
	 */
	handle = (callback, handleEvenWhenFalsy = false) => {
		if (this.element instanceof HTMLElement || !handleEvenWhenFalsy) {
			// @ts-ignore
			callback(this.element);
		}
	};
}
