export class Storage {
    /**
     * @type {Storage}
     */
    static __: Storage;
    /**
     * @private
     */
    private static identifier;
    /**
     * @private
     * @param {string} name
     * @returns {string}
     */
    private static scopedName;
    /**
     * @typedef {{[uniqueName:string]:string}} storageType
     * - value is for defaultValue;
     * @param {{
     * local?:storageType,
     * session?:storageType,
     * }} data
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
}
import { Let } from './Let.mjs';
