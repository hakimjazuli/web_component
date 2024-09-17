/**
 * @description
 * `eventListener` helper to create `autoqueued`-`autocsoped` callback;
 * ```js
 * // @ts-check
 * someObject.addEventListener('click', Event_.listener( (event) => {
 * // code
 * }))
 * ```
 * - why?
 * > - well, our `signal` based reactivity is all `autoscoped` on `WebComponent ShadowRoot`, but with event handler, it will be out of scoped;
 * > - with this static method, you can safely instantiated our `signal`
 */
export class Event_ {
    /**
     * @param {(event:Event)=>Promise<any>} scopedCallback
     */
    static listener: (scopedCallback: (event: Event) => Promise<any>) => (event: Event) => void;
}
