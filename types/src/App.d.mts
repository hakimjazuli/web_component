/**
 * @description
 * Render Helper to `document.body`
 */
export class App {
    /**
     * render string to element.innerHTML that fit `#id` selector
     * - `Define`-prefixed options: serves no purposes other than to make sure for js runtime to statically imports the respective instance before `App` instantiation;
     * @param {Object} options
     * @param {string} options.idName
     * @param {WebComponent} options.rootComponent
     * @param {string} [options.globalStyle_]
     * @param {import("./DefineQRouter.mjs").DefineQRouter} [options.DefineQRouter]
     * @param {import("./DefineStorage.mjs").DefineStorage} [options.DefineStorage]
     * @param {import("./DefineShortCuts.mjs").DefineShortCuts} [options.DefineShortCuts]
     */
    constructor({ idName, rootComponent, globalStyle_, DefineQRouter, DefineStorage, DefineShortCuts, }: {
        idName: string;
        rootComponent: WebComponent<any, any, any, any>;
        globalStyle_?: string;
        DefineQRouter?: import("./DefineQRouter.mjs").DefineQRouter<any, any>;
        DefineStorage?: import("./DefineStorage.mjs").DefineStorage;
        DefineShortCuts?: import("./DefineShortCuts.mjs").DefineShortCuts<any, any>;
    });
}
import { WebComponent } from './WebComponent.mjs';
