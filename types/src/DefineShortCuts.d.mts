/**
 * @description
 * create shortcut through class instantiation;
 * - register by putting it in the instantiation of [App](#app)
 */
/**
 * @template {{
 * [shortcutName:string]:{
 * action:(key:KeyboardEvent)=>boolean,
 * asyncCallback:()=>Promise<void>,
 * }
 * }} namedShortCut
 * @template {Extract<keyof namedShortCut, string>} ShortCutName
 */
export class DefineShortCuts<namedShortCut extends {
    [shortcutName: string]: {
        action: (key: KeyboardEvent) => boolean;
        asyncCallback: () => Promise<void>;
    };
}, ShortCutName extends Extract<keyof namedShortCut, string>> {
    /**
     * @type {DefineShortCuts}
     */
    static __: DefineShortCuts<any, any>;
    /**
     * @param {namedShortCut} shortcutList
     */
    constructor(shortcutList: namedShortCut);
    /**
     * @type {Record.<ShortCutName, Ping["ping"]>}
     */
    pings: Record<ShortCutName, Ping["ping"]>;
}
import { Ping } from './Ping.mjs';
