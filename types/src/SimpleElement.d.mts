/**
 * - document.createElement` helper
 * - as well as property and attribute setter
 */
export class SimpleElement {
    /**
     * @param {Object} options
     * @param {string} options.tagName
     * @param {{
     * [attrNameNPropName:string]:string
     * }} [options.attributeNProperty]
     */
    constructor({ tagName, attributeNProperty }: {
        tagName: string;
        attributeNProperty?: {
            [attrNameNPropName: string]: string;
        };
    });
    element: HTMLElement;
    string: string;
}
