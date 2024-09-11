/**
 * Render Helper to `document.body`
 */
export class Render {
    /**
     * render string to element.innerHTML that fit `#id` selector
     * @param {{
     * idName:string,
     * rootTag:WebComponent,
     * useSPARouter?:boolean,
     * globalStyle_?:string,
     * }} options
     */
    constructor({ idName, rootTag, useSPARouter, globalStyle_ }: {
        idName: string;
        rootTag: WebComponent<any, any, any, any>;
        useSPARouter?: boolean;
        globalStyle_?: string;
    });
}
import { WebComponent } from './WebComponent.mjs';
