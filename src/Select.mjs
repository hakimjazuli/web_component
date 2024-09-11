// @ts-check

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
