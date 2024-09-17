/**
 * @template V
 * @extends {Let_<V>}
 */
export class Let<V> extends Let_<V> {
    /**
     * - auto globally scoped (no `domReflector`), even during call that
     * `spaHelper.currentDocumentScope` is scoped to `WebComponent`
     * - usefull for dynamic data generation (during `WebComponent`'s `lifecycle`) which require no `domReflector`;
     * @template V
     * @param {V} value
     * @returns {Let<V>}
     */
    static dataOnly: <V_1>(value: V_1) => Let<V_1>;
    /**
     * @param {V} value
     * @param {import('@html_first/simple_signal').documentScope} [documentScope]
     */
    constructor(value: V, documentScope?: import("@html_first/simple_signal").documentScope);
    documentScope: import("@html_first/simple_signal").documentScope;
    /**
     * @type {string}
     */
    attr: string;
}
import { Let as Let_ } from '@html_first/simple_signal';
