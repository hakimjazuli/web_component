export class LetURL {
    /**
     * @type {{
     * [name:string]: Let_<string>
     * }}
     */
    static queryList: {
        [name: string]: Let_<string>;
    };
    /**
     * @param {string} paramName
     * @param {string} paramValue
     */
    static updateQueryParams: (paramName: string, paramValue: string) => void;
    /**
     * @param {{
     * name:string,
     * value?:string,
     * onRouteChangedCallback?:(currentQueryValue:string)=>Promise<void>
     * }} options
     */
    constructor({ name, value, onRouteChangedCallback }: {
        name: string;
        value?: string;
        onRouteChangedCallback?: (currentQueryValue: string) => Promise<void>;
    });
    /**
     * query
     * @type {Let_<string>}
     */
    query: Let_<string>;
    /**
     * @private
     * @type {string}
     */
    private paramName;
    /**
     * @private
     * @type {Ping_|null}
     */
    private queryChangePing;
    unSub: () => void;
}
