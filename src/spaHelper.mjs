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
	static attr = '';
	/**
	 * @return {string|undefined}
	 */
	static attributeIndexGenerator = () => {
		if (spaHelper.currentDocumentScope === window.document) {
			return;
		}
		return (this.attr = `atla-as-${this.generateUniqueString()}`);
	};
	/**
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	static currentDocumentScope = window.document;
}
