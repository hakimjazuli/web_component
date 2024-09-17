/**
 * - trigger based callback integrated to the internal queue handler;
 */
export class Ping extends Ping_ {
    /**
     * @typedef {Object} manualScopeOptions
     * @property {import('@html_first/simple_signal').documentScope} documentScope
     * @property {()=>Promise<void>} scopedCallback
     * @property {boolean} runCheckAtFirst
     */
    /**
     * manual scoping for lib internal functionality
     * @param {manualScopeOptions} options
     * @returns {Ping["ping"]}
     */
    static manualScope: ({ documentScope, scopedCallback, runCheckAtFirst }: {
        documentScope: import("@html_first/simple_signal").documentScope;
        scopedCallback: () => Promise<void>;
        runCheckAtFirst: boolean;
    }) => Ping["ping"];
    /**
     * @typedef {Object} autoScopeOptions
     * @property {()=>Promise<void>} scopedCallback
     * @property {boolean} runCheckAtFirst
     */
    /**
     * use for handling out of scoped codeblock:
     * @param {autoScopeOptions} options
     * @return {Ping["ping"]}
     */
    static autoScope: ({ scopedCallback, runCheckAtFirst }: {
        scopedCallback: () => Promise<void>;
        runCheckAtFirst: boolean;
    }) => Ping["ping"];
    /**
     * - unscoped ping
     * - callback will be called when returned function is called
     * @param {()=>Promise<void>} asyncCallback
     * @return {Ping["ping"]}
     */
    static unScopedOnCall: (asyncCallback: () => Promise<void>) => Ping["ping"];
}
import { Ping as Ping_ } from '@html_first/simple_signal';
