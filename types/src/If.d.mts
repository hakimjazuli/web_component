/**
 * @description
 * - handling conditional string as `innerHTML`;
 * ```js
 * htmlTemplate: htmlLiteral`${new If.tag(options).string}`
 * ```
 * > - the functionality is the same with using:
 * ```js
 * htmlTemplate: htmlLiteral`<div ${derivedIntance.attr}="innerHTML"></div>`
 * ```
 * > -   `WARNING!!!`: you better make sure the data is safe;
 */
export class If {
    /**
     * @private
     */
    private static IfTag;
    /**
     * @param {()=>Promise<string>} stringLogic
     */
    static tag: (stringLogic: () => Promise<string>) => {
        element: HTMLElement;
        string: string;
        shadowRoot: ShadowRoot;
        attr: string;
    };
}
