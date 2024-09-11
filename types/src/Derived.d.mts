/**
 * - signal based reactivity, wich value are derived from `Let<T>.value`;
 * @template V
 * @extends {Derived_<V>}
 */
export class Derived<V> {
    /**
     * @param {()=>Promise<V>} asyncCallback
     * @param {import('@html_first/simple_signal').documentScope} documentScope
     */
    constructor(asyncCallback: () => Promise<V>, documentScope?: any);
    attr: string;
}
