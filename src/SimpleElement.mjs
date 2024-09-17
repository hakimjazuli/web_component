// @ts-check

/**
 * @description
 * - document.createElement` helper
 * - as well as property and attribute setter
 * ```js
 * const simpleElementExample = new SimpleElement(options);
 * ```
 */
export class SimpleElement {
	/**
	 * @param {Object} options
	 * @param {string} options.tagName
	 * @param {{
	 * [attrNameNPropName:string]:string
	 * }} [options.attributeNProperty]
	 */
	constructor({ tagName, attributeNProperty = {} }) {
		this.element = document.createElement(tagName);
		for (const attrNameNPropName in attributeNProperty) {
			try {
				if (!(attrNameNPropName in this.element)) {
					throw '';
				}
				if (this.element[attrNameNPropName] != attributeNProperty[attrNameNPropName]) {
					this.element[attrNameNPropName] = attributeNProperty[attrNameNPropName];
				}
			} catch (error) {
				if (
					attributeNProperty[attrNameNPropName] !=
					this.element.getAttribute(attrNameNPropName)
				) {
					this.element.setAttribute(
						attrNameNPropName,
						attributeNProperty[attrNameNPropName]
					);
				}
			}
		}
		this.string = this.element.outerHTML;
	}
}
