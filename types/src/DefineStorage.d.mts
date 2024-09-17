/**
 * @description
 * create named storage (`localStorage` or `sessionStorage`) through class instantiation;
 * - register by putting it in the instantiation of [App](#app)
 */
export class DefineStorage {
    /**
     * @type {DefineStorage}
     */
    static __: DefineStorage;
    /**
     * @private
     */
    private static identifier;
    /**
     * @private
     * @param {string} name
     * @returns {string}
     */
    private static nameSpace;
    /**
     * @typedef {{[uniqueName:string]:string}} storageType
     * - value is for defaultValue;
     * @param {Object} data
     * @param {storageType} [data.local]
     * @param {storageType} [data.session]
     */
    constructor({ local, session }: {
        local?: {
            [uniqueName: string]: string;
        };
        session?: {
            [uniqueName: string]: string;
        };
    });
    /**
     * @type { storageType }
     */
    defaultLocal: {
        [uniqueName: string]: string;
    };
    /**
     * @type { storageType }
     */
    defaultSession: {
        [uniqueName: string]: string;
    };
    /**
     * @typedef {{[uniqueName:string]:Let<string>}} storageSignalType
     * @param {storageSignalType} local
     * @param {storageSignalType} session
     */
    data: Let<{
        local: {};
        session: {};
    }>;
    /**
     * @private
     * @param {"session"|"local"} storage
     * @param {string} name
     * @param {string} defaultValue
     */
    private resolve;
    refreshLocal: () => void;
    refreshSession: () => void;
    refreshBoth: () => void;
    /**
     * @private
     * delete previously set by app, but no longer on the list;
     */
    private autoDeprecate;
}
import { Let } from './Let.mjs';
