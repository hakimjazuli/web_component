/**
 * @description
 * it uses `native web component semantics`;
 * ```js
 * // declaring
 * export const Button = new WebComponent(options);
 * // making html element string
 * // in WebComponent scope
 * htmlTemplate: htmlLiteral`${Button.tag(options).string}`
 * ```
 */
/**
 * @template {{
 * [x: string]: ''
 * }} Slots
 * @template {Extract<keyof Slots, string>} SlotName
 * @template {{
 * [x: string]: string
 * }} observedAttributes
 * @template {Extract<keyof observedAttributes, string>} observedAttribute
 */
export class WebComponent<Slots extends {
    [x: string]: "";
}, SlotName extends Extract<keyof Slots, string>, observedAttributes extends {
    [x: string]: string;
}, observedAttribute extends Extract<keyof observedAttributes, string>> {
    /**
     * @private
     */
    private static tagIndex;
    /**
     * @private
     */
    private static generateTag;
    /**
     * @private
     * @param {string} string
     * @returns {string}
     */
    private static validateTag;
    /**
     * @type {string}
     */
    static globalStyle: string;
    /**
     * @private
     */
    private static callbackHandlerIdentifier;
    /**
     * @typedef {()=>void} voidFnType
     * @typedef {(options:{propName:observedAttribute, oldValue:string, newValue:string})=>void} attributeChangedCallbackType
     * @typedef {()=>(void|{
     * disconnectedCallback?:voidFnType,
     * attributeChangedCallback?:attributeChangedCallbackType,
     * adoptedCallback?:voidFnType,
     * })
     * } connectedCallbackType
     */
    /**
     * @typedef CustomElementParameters
     * @property {observedAttributes} [observedAttributes]
     * @property {(options:{
     * observedAttributesSignal: Record.<observedAttribute, Let<string>>,
     * createSlot:(slotName:SlotName)=>string,
     * shadowRoot:ShadowRoot,
     * thisElement:HTMLElement,
     * }
     * )=>{
     * htmlTemplate: string,
     * connectedCallback?: connectedCallbackType,
     * }} lifecycle
     * use shadowRoot to manually scope `signal` reactivity on:
     * - code that are outside of lifecycle scoped;
     * - `eventListeners` callback;
     * - `Ping` scoped asyncCallback;
     * @property {string} [tagPrefix]
     * @property {Slots} [slots]
     * @property {string} [tagName]
     * @property {string[]} [importStyles]
     * - absolute path
     * @property {typeof HTMLElement} [extendsElement]
     */
    /**
     * @param {CustomElementParameters} options
     */
    constructor(options: {
        observedAttributes?: observedAttributes;
        /**
         * use shadowRoot to manually scope `signal` reactivity on:
         * - code that are outside of lifecycle scoped;
         * - `eventListeners` callback;
         * - `Ping` scoped asyncCallback;
         */
        lifecycle: (options: {
            observedAttributesSignal: Record<observedAttribute, Let<string>>;
            createSlot: (slotName: SlotName) => string;
            shadowRoot: ShadowRoot;
            thisElement: HTMLElement;
        }) => {
            htmlTemplate: string;
            connectedCallback?: () => (void | {
                disconnectedCallback?: () => void;
                attributeChangedCallback?: (options: {
                    propName: observedAttribute;
                    oldValue: string;
                    newValue: string;
                }) => void;
                adoptedCallback?: () => void;
            });
        };
        tagPrefix?: string;
        slots?: Slots;
        tagName?: string;
        /**
         * - absolute path
         */
        importStyles?: string[];
        extendsElement?: typeof HTMLElement;
    });
    /**
     * @typedef {Object} callbackHandlerValue
     * @property {tagOptionCCB} connectedCallback
     * @property {(options:{propName:string,oldValue:string,newValue:string})=>void} [attributeChangedCallback]
     * @property {()=>void} [adoptedCallback]
     * @property {void|(()=>void)} [disconnectedCallback]
     */
    /**
     * @private
     * @type {{
     * [callbackId:string]:callbackHandlerValue
     * }}
     */
    private callbackHandler;
    /**
     * @typedef {Object} tagOptionCCBReturns
     * @property {function(): void} [disconnectedCallback] - A callback function invoked when the element is disconnected from the document.
     * @property {(options:{propName:string,oldValue:string,newValue:string})=> void} [attributeChangedCallback] - A callback function invoked when an attribute of the element is changed.
     * @property {function(): void} [adoptedCallback] - A callback function invoked when the element is adopted into a new document.
     */
    /**
     * @typedef {Object} tagOptionCCBArgs
     * @property {Record<observedAttribute, Let<string>>} observedAttributesSignal
     * @property {ShadowRoot} shadowRoot
     * @property {HTMLElement} thisElement
     */
    /**
     * @typedef {(options:tagOptionCCBArgs)=>void|tagOptionCCBReturns} tagOptionCCB
     */
    /**
     * @typedef {Object} tagReturn
     * @property {HTMLElement} element
     * @property {string} string
     * @property {ShadowRoot} shadowRoot
     * @property {string} attr
     */
    /**
     * create element
     * @param {Object} [options]
     * @param {Record.<observedAttribute, string>} [options.observedAttributes]
     * @param {Record.<SlotName, HTMLElement>} [options.slots]
     * @param {Record.<string, string>} [options.attributes]
     * @param {tagOptionCCB} [options.connectedCallback]
     * @returns {tagReturn}
     */
    tag: ({ observedAttributes, slots, attributes, connectedCallback }?: {
        observedAttributes?: Record<observedAttribute, string>;
        slots?: Record<SlotName, HTMLElement>;
        attributes?: Record<string, string>;
        connectedCallback?: (options: {
            observedAttributesSignal: Record<observedAttribute, Let<string>>;
            shadowRoot: ShadowRoot;
            thisElement: HTMLElement;
        }) => void | {
            /**
             * - A callback function invoked when the element is disconnected from the document.
             */
            disconnectedCallback?: () => void;
            /**
             * - A callback function invoked when an attribute of the element is changed.
             */
            attributeChangedCallback?: (options: {
                propName: string;
                oldValue: string;
                newValue: string;
            }) => void;
            /**
             * - A callback function invoked when the element is adopted into a new document.
             */
            adoptedCallback?: () => void;
        };
    }) => {
        element: HTMLElement;
        string: string;
        shadowRoot: ShadowRoot;
        attr: string;
    };
    /**
     * @type {string}
     */
    tagName: string;
}
import { Let } from './Let.mjs';
