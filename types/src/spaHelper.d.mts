export class spaHelper {
    /**
     * @private
     */
    private static generateUniqueString;
    static attr: string;
    /**
     * @return {string|undefined}
     */
    static attributeIndexGenerator: () => string | undefined;
    /**
     * @type {import('@html_first/simple_signal').documentScope}
     */
    static currentDocumentScope: any;
}
