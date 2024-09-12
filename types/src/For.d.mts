/**
 * - handling looped tag
 * @template {{
 * [x: string]: ''
 * }} ListTemplate
 */
export class For<ListTemplate extends {
    [x: string]: "";
}> {
    static forTag: WebComponent<{
        [x: string]: "";
    }, string, {
        [x: string]: string;
    }, string>;
    /**
     * @typedef {Let<Array<Record<keyof NonNullable<ListTemplate>, Let<string>>>>} derivedListType
     */
    /**
     * @param {{
     * listTemplate:ListTemplate,
     * childElement:HTMLElement,
     * addParentElement?:HTMLElement|ShadowRoot
     * }} options
     */
    constructor({ listTemplate, childElement, addParentElement }: {
        listTemplate: ListTemplate;
        childElement: HTMLElement;
        addParentElement?: HTMLElement | ShadowRoot;
    });
    /**
     * @private
     * @type {ListTemplate}
     */
    private listTemplate;
    /**
     * @private
     * @type {HTMLElement|ShadowRoot|undefined}
     */
    private addParentElement;
    /**
     * @type {derivedListType}
     */
    data: Let<Record<keyof NonNullable<ListTemplate>, Let<string>>[]>;
    childElement: HTMLElement;
    /**
     * @private
     */
    private alreadyAssigned;
    /**
     * @param {{
     * assignData:()=>Promise<derivedListType["value"]>
     * }} options
     */
    tag: ({ assignData }: {
        assignData: () => Promise<Record<keyof NonNullable<ListTemplate>, Let<string>>[]>;
    }) => {
        element: HTMLElement;
        string: string;
        shadowRoot: ShadowRoot;
        attr: string;
    };
    /**
     * @private
     * @type {ShadowRoot|HTMLElement}
     */
    private parentElement;
    /**
     * @private
     * @param {derivedListType["value"]} data
     */
    private reflectData;
    /**
     * - no need to be public, as it can be controlled using instance.data.value[index][attributeOrPropName].value
     * @private
     * @param {number} index
     */
    private reflectDataToDOM;
    /**
     * @param {Record<keyof NonNullable<ListTemplate>, Let<string>>} childData
     */
    addChild: (childData: Record<keyof NonNullable<ListTemplate>, Let<string>>) => void;
    /**
     * @param {number|NaN|Let<string>} indexOrSignal
     */
    removeChild: (indexOrSignal: number | number | Let<string>) => void;
}
import { Let } from './Let.mjs';
import { WebComponent } from './WebComponent.mjs';
