// @ts-check

/**
 * - document.createElement` helper
 * - as well as property and attribute setter
 */
export class SimpleElement {
	/**
	 * @param {{
	 * tagName:string,
	 * attributeNProperty?: {
	 * [attrNameNPropName:string]:string
	 * }}} options
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
						this.element.getAttribute(attrNameNPropName) ??
					''
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
