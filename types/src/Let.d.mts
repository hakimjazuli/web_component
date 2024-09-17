/**
 * @description
 * - `signal` based reactivity;
 * ```js
 * // @ts-check
 * // in WebComponent scope
 * const letSingle = new Let(1);
 * ```
 * - property `attr`, string helper to identify the `HTML attributeName`
 * ```js
 * // in WebComponent scope
 * // you can use `attr` to bind it to a HTML tag as attribute
 * htmlTemplate: htmlLiteral`<div ${letSingle.attr}="innerText"></div>`
 * ```
 * - static method `dataOnly`, a behaviour modifier for this class instantiation, to optout from this library built in `setDOMReflector`;
 * ```js
 * // in WebComponent scope
 * const dataOnlyExample = Let.dataOnly(1) // this instance have undefined `attr` value;
 * ```
 * - assigning newValue to Let insance:
 * ```js
 * const letSingle = new Let(1);
 * letSingle.value++; // 2;
 * letSingle.value = 3 // 3;
 * ```
 */
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
