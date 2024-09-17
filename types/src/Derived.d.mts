/**
 * @description
 * - `signal` based reactivity, wich value are derived from reacting to [`Let<T>.value`](#let) effects that are called in the `asyncCallback` this class instantiation;
 * ```js
 * // @ts-check
 * // in WebComponent scope
 * const letSingle = new Let(1);
 * const doubleExample = new Derived(async()=>{
 * 	const value = letSingle.value; // autoscubscribed to `letSingle` value changes;
 * return value * 2; // returned value are to be derivedValue
 * });
 * ```
 * - property `attr`, string helper to identify the `HTML attributeName`
 * ```js
 * // in WebComponent scope
 * // you can use `attr` to bind it to a HTML tag as attribute
 * htmlTemplate: htmlLiteral`<div ${doubleExample.attr}="innerText"></div>`
 * ```
 * - static method `dataOnly`, a behaviour modifier for this class instantiation, to optout from this library built in `setDOMReflector`;
 * ```js
 * // in WebComponent scope
 * const letSingle = new Let(1);
 * const dataOnlyExample = Derived.dataOnly(async()=>{
 *  return value * 2;
 * }) // this instance have undefined `attr` value;
 * ```
 */
/**
 * @template V
 * @extends {Derived_<V>}
 */
export class Derived<V> extends Derived_<V> {
    /**
     * - auto globally scoped (no `domReflector`), even during call that
     * `spaHelper.currentDocumentScope` is scoped to `WebComponent`
     * - usefull for dynamic data generation (during `WebComponent`'s `lifecycle`) which require no `domReflector`;
     * @template V
     * @param {()=>Promise<V>} asyncCallback
     * @returns {Derived<V>}
     */
    static dataOnly: <V_1>(asyncCallback: () => Promise<V_1>) => Derived<V_1>;
    /**
     * @param {()=>Promise<V>} asyncCallback
     * @param {import('@html_first/simple_signal').documentScope} documentScope
     */
    constructor(asyncCallback: () => Promise<V>, documentScope?: import("@html_first/simple_signal").documentScope);
    attr: string;
}
import { Derived as Derived_ } from '@html_first/simple_signal';
