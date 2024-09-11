/**
 * - handling conditional string as `innerHTML`;
 *   > -   `WARNING!!!`: you better make sure the data is safe;
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
