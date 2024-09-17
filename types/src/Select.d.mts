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
 * 			connected: () => {
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
    constructor(letInstance: {
        attr: string;
    }, documentScope: import("@html_first/simple_signal").documentScope);
    element: Element;
    /**
     * @param {(HTMLElement:HTMLElement)=>void} callback
     * @param {boolean} [handleEvenWhenFalsy]
     * - true: for checking purposes
     */
    handle: (callback: (HTMLElement: HTMLElement) => void, handleEvenWhenFalsy?: boolean) => void;
}
