/**
 * Render Helper to `document.body`
 */
export class Render {
    /**
     * render string to element.innerHTML that fit `#id` selector
     * @param {{
     * idName:string,
     * rootComponent:WebComponent,
     * useSPARouter?:boolean,
     * globalStyle_?:string,
     * }} options
     */
    constructor({ idName, rootComponent, useSPARouter, globalStyle_ }: {
        idName: string;
        rootComponent: WebComponent<any, any, any, any>;
        useSPARouter?: boolean;
        globalStyle_?: string;
    });
}
import { WebComponent } from './WebComponent.mjs';
