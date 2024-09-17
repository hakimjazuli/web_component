/**
 * Search-Query-Param Router
 * @template {{
 * [queryName:string]:
 * handlerType
 * }} dataValueType
 * @template {Extract<keyof dataValueType, string>} NamedQueryParam
 */
export class DefineQRouter<dataValueType extends {
    [queryName: string]: {
        value?: string;
        clearQueriesWhenImSet?: NamedQueryParam[];
        clearAllQueriesExcept?: NamedQueryParam[];
    };
}, NamedQueryParam extends Extract<keyof dataValueType, string>> {
    /**
     * @type {DefineQRouter}
     */
    static __: DefineQRouter<any, any>;
    /**
     * @param {Object} options
     * @param {dataValueType} options.data
     * @param {number} [options.queryChangeThrottleMs]
     */
    constructor({ data, queryChangeThrottleMs: queryChangeThrottle }: {
        data: dataValueType;
        queryChangeThrottleMs?: number;
    });
    /**
     * @private
     * @typedef {Object} handlerType
     * @property {string} [value]
     * @property {NamedQueryParam[]} [clearQueriesWhenImSet]
     * @property {NamedQueryParam[]} [clearAllQueriesExcept]
     */
    private handler;
    /**
     * @type {Record.<NamedQueryParam, Let<string>>}
     */
    data: Record<NamedQueryParam, Let<string>>;
    /**
     * @private
     * @param {Ping["ping"]} ping
     */
    private queryChangeThrottle;
    /**
     * @private
     * @type { null|number }
     */
    private timeoutId;
    /**
     * @private
     * @param {Ping["ping"]} ping
     */
    private requestChanges;
    /**
     * @private
     */
    private pushPing;
    currentQuery: Let<string>;
    /**
     * @private
     */
    private registerPopStateEventListener;
    /**
     * @private
     */
    private popPing;
}
import { Let } from './Let.mjs';
