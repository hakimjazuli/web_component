// @ts-check

export class spaHelper {
	/**
	 * @private
	 */
	static generateUniqueString() {
		const timestamp = Date.now();
		const randomPart = Math.floor(Math.random() * 1_000_000);
		return `${timestamp}${randomPart}`;
	}
	/**
	 * @type {string|null}
	 */
	static attr = null;
	/**
	 * @return {string|undefined}
	 */
	static attributeIndexGenerator = () => {
		if (spaHelper.currentDocumentScope == window.document) {
			return (this.attr = null);
		}
		return (this.attr = `atla-as-attr-${this.generateUniqueString()}`);
	};
	/**
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	static currentDocumentScope = window.document;
	/**
	 * @param {Object} class_
	 */
	static warningSingleton = (class_) => {
		console.warn({
			class: class_,
			message: 'is a singleton class, and can only be instantiated once',
		});
	};
}
