/**
 * @template V
 * @extends {Let_<V>}
 */
export class Let<V> {
    /**
     * @param {V} value
     * @param {import('@html_first/simple_signal').documentScope} [documentScope]
     */
    constructor(value: V, documentScope?: any);
    documentScope: any;
    /** @type {string} */
    attr: string;
}
