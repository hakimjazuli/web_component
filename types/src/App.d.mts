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
    constructor({ idName, rootComponent, globalStyle_, DefineQRouter, DefineStorage, DefineShortCuts, }: {
        idName: string;
        rootComponent: ReturnType<({ observedAttributes, slots, attributes, connectedCallback }?: {
            observedAttributes?: Record<any, string>;
            slots?: Record<any, HTMLElement>;
            attributes?: Record<string, string>;
            connectedCallback?: (options: {
                observedAttributesSignal: Record<any, import("./Let.mjs").Let<string>>;
                shadowRoot: ShadowRoot;
                thisElement: HTMLElement;
            }) => void | {
                /**
                 * - A callback function invoked when the element is disconnected from the document.
                 */
                disconnectedCallback?: () => void;
                /**
                 * - A callback function invoked when an attribute of the element is changed.
                 */
                attributeChangedCallback?: (options: {
                    observedAttributeName: string;
                    oldValue: string;
                    newValue: string;
                }) => void;
                /**
                 * - A callback function invoked when the element is adopted into a new document.
                 */
                adoptedCallback?: () => void;
            };
        }) => {
            element: HTMLElement;
            string: string;
            shadowRoot: ShadowRoot;
            attr: string;
        }>;
        globalStyle_?: string;
        DefineQRouter?: import("./DefineQRouter.mjs").DefineQRouter<any, any>;
        DefineStorage?: import("./DefineStorage.mjs").DefineStorage;
        DefineShortCuts?: import("./DefineShortCuts.mjs").DefineShortCuts<any, any>;
    });
}
