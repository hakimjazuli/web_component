/**
 * @template V
 * @extends {Let_<V>}
 */
export class Let<V> extends Let_<V> {
    /**
     * @param {V} value
     * @param {import('@html_first/simple_signal').documentScope} [documentScope]
     */
    constructor(value: V, documentScope?: import("@html_first/simple_signal").documentScope);
    documentScope: any;
    /** @type {string} */
    attr: string;
}
import { Let as Let_ } from '@html_first/simple_signal';
