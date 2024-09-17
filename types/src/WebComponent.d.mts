/**
 * @template {{
 * [x: string]: ''
 * }} Slots
 * @template {Extract<keyof Slots, string>} SlotName
 * @template {{
 * [x: string]: string
 * }} defaultProps
 * @template {Extract<keyof defaultProps, string>} Prop
 */
export class WebComponent<Slots extends {
    [x: string]: "";
}, SlotName extends Extract<keyof Slots, string>, defaultProps extends {
    [x: string]: string;
}, Prop extends Extract<keyof defaultProps, string>> {
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
     * @typedef {(options:{propName:Prop, oldValue:string, newValue:string})=>void} attributeChangedCallbackType
     * @typedef {()=>(void|{
     * disconnectedCallback?:voidFnType,
     * attributeChangedCallback?:attributeChangedCallbackType,
     * adoptedCallback?:voidFnType,
     * })
     * } connectedCallbackType
     */
    /**
     * @typedef CustomElementParameters
     * @property {defaultProps} [defaultProps]
     * @property {(options:{
     * propsManipulator:(props: Prop) => { value: string },
     * reactiveProps: Record.<Prop, Let<string>>,
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
     */
    /**
     * @param {CustomElementParameters} options
     */
    constructor(options: {
        defaultProps?: defaultProps;
        /**
         * use shadowRoot to manually scope `signal` reactivity on:
         * - code that are outside of lifecycle scoped;
         * - `eventListeners` callback;
         * - `Ping` scoped asyncCallback;
         */
        lifecycle: (options: {
            propsManipulator: (props: Prop) => {
                value: string;
            };
            reactiveProps: Record<Prop, Let<string>>;
            createSlot: (slotName: SlotName) => string;
            shadowRoot: ShadowRoot;
            thisElement: HTMLElement;
        }) => {
            htmlTemplate: string;
            connectedCallback?: () => (void | {
                disconnectedCallback?: () => void;
                attributeChangedCallback?: (options: {
                    propName: Prop;
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
    });
    /**
     * @typedef {Object} callbackHandlerValue
     * @property {tagOptionCCB} connected
     * @property {()=>void} [attributeChanged]
     * @property {()=>void} [adopted]
     * @property {void|(()=>void)} [disconnected]
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
     * @property {function(): void} [attributeChangedCallback] - A callback function invoked when an attribute of the element is changed.
     * @property {function(): void} [adoptedCallback] - A callback function invoked when the element is adopted into a new document.
     */
    /**
     * @typedef {Object} tagOptionCCBArgs
     * @property {(props: Prop) => { value: string }} propsManipulator
     * @property {Record<Prop, Let<string>>} reactiveProps
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
     * @param {Record.<Prop, string>} [options.props]
     * @param {Record.<SlotName, HTMLElement>} [options.slots]
     * @param {Record.<string, string>} [options.attributes]
     * @param {tagOptionCCB} [options.connectedCallback]
     * @returns {tagReturn}
     */
    tag: ({ props, slots, attributes, connectedCallback }?: {
        props?: Record<Prop, string>;
        slots?: Record<SlotName, HTMLElement>;
        attributes?: Record<string, string>;
        connectedCallback?: (options: {
            propsManipulator: (props: Prop) => {
                value: string;
            };
            reactiveProps: Record<Prop, Let<string>>;
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
            attributeChangedCallback?: () => void;
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
