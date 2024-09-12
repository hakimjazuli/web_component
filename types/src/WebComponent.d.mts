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
     * @private
     * @type {{
     * [callbackId:string]:{
     * connected:elementCreateConnectedCallbackType,
     * attributeChanged?:()=>void,
     * adopted?:()=>void,
     * disconnected?:void|(()=>void)
     * }
     * }}
     */
    private callbackHandler;
    /**
     * @type {string}
     */
    tagName: string;
    /**
     * @typedef {(options:{
     * propsManipulator:(props: Prop) => { value: string },
     * reactiveProps: Record.<Prop, Let<string>>,
     * shadowRoot:ShadowRoot,
     * thisElement:HTMLElement
     * })=>void|{
     * disconnectedCallback?:()=>void,
     * attributeChangedCallback?:()=>void,
     * adoptedCallback?:()=>void,
     * }
     * } elementCreateConnectedCallbackType
     */
    /**
     * @typedef {{
     * props?:Record.<Prop, string>,
     * slots?:Record.<SlotName, HTMLElement>,
     * attributes?:Record.<string, string>,
     * connectedCallback?:elementCreateConnectedCallbackType,
     * }} elementCreateOptionType
     * - connectedCallback: use this to add aditional (dis)connected callback
     * > - usefull for attaching eventListener and removing it;
     */
    /**
     * create element
     * @param {elementCreateOptionType} [options]
     * @returns {{element:HTMLElement,string:string,shadowRoot:ShadowRoot,attr:string}}
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
            disconnectedCallback?: () => void;
            attributeChangedCallback?: () => void;
            adoptedCallback?: () => void;
        };
    }) => {
        element: HTMLElement;
        string: string;
        shadowRoot: ShadowRoot;
        attr: string;
    };
    /**
     * @private
     * @type {string}
     */
    private validatedTag;
}
import { Let } from './Let.mjs';
