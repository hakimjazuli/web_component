export class spaHelper {
    /**
     * @private
     */
    private static generateUniqueString;
    /**
     * @type {string|null}
     */
    static attr: string | null;
    /**
     * @return {string|undefined}
     */
    static attributeIndexGenerator: () => string | undefined;
    /**
     * @type {import('@html_first/simple_signal').documentScope}
     */
    static currentDocumentScope: import("@html_first/simple_signal").documentScope;
    /**
     * @param {Object} class_
     */
    static warningSingleton: (class_: any) => void;
}
