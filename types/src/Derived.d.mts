/**
 * - signal based reactivity, wich value are derived from `Let<T>.value`;
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
