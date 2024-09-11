/**
 * - handling looped tag
 * @template {{
 * [x: string]: ''
 * }} ListTemplate
 */
export class For<ListTemplate extends {
    [x: string]: "";
}> extends WebComponent<any, any, any, any> {
    /**
     * @typedef {Let<Array<Record<keyof NonNullable<ListTemplate>, Let<string>>>>} derivedListType
     */
    /**
     * @param {{
     * listTemplate:ListTemplate,
     * childElement:HTMLElement,
     * data:Let<Array<Record<keyof NonNullable<ListTemplate>, string>>>,
     * addParentElement?:HTMLElement|ShadowRoot
     * }} options
     */
    constructor({ listTemplate, data, childElement, addParentElement }: {
        listTemplate: ListTemplate;
        childElement: HTMLElement;
        data: Let<Array<Record<keyof NonNullable<ListTemplate>, string>>>;
        addParentElement?: HTMLElement | ShadowRoot;
    });
    listTemplate: ListTemplate;
    /**
     * @private
     * @type {ShadowRoot}
     */
    private shadowRoot;
    /**
     * @private
     * @type {ShadowRoot|HTMLElement}
     */
    private parentElement;
    /**
     * @type {derivedListType}
     */
    data: Let<Record<keyof NonNullable<ListTemplate>, Let<string>>[]>;
    childElement: HTMLElement;
    /**
     * @param {Array<Record<keyof NonNullable<ListTemplate>, string>>} overwriteData
     */
    overwriteData: (overwriteData: Array<Record<keyof NonNullable<ListTemplate>, string>>) => void;
    /**
     * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
     * @param {number} index
     */
    editData: (newData: Record<keyof NonNullable<ListTemplate>, string>, index: number) => void;
    /**
     * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
     */
    addChild: (newData: Record<keyof NonNullable<ListTemplate>, string>) => void;
    /**
     * @param {number|NaN|Let<string>} indexOrSignal
     */
    removeChild: (indexOrSignal: number | number | Let<string>) => void;
    /**
     * @private
     * - not a static method, so `ListTemplate` can be used to typehint;
     * @param {Record<keyof NonNullable<ListTemplate>, Let<string>>} data
     * @returns {HTMLElement|Node}
     */
    private generateChild;
}
import { WebComponent } from './WebComponent.mjs';
import { Let } from './Let.mjs';
