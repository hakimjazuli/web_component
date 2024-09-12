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
     * addParentElement?:HTMLElement|ShadowRoot
     * }} options
     */
    constructor({ listTemplate, childElement, addParentElement }: {
        listTemplate: ListTemplate;
        childElement: HTMLElement;
        addParentElement?: HTMLElement | ShadowRoot;
    });
    listTemplate: ListTemplate;
    shadowRoot: ShadowRoot;
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
     * @private
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
import { WebComponent } from './WebComponent.mjs';
import { Let } from './Let.mjs';
