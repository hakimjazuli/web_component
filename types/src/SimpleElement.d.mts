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
    constructor({ tagName, attributeNProperty }: {
        tagName: string;
        attributeNProperty?: {
            [attrNameNPropName: string]: string;
        };
    });
    element: HTMLElement;
    string: string;
}
