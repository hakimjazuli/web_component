// @ts-check

import { Let } from './Let.mjs';
import { spaHelper } from './spaHelper.mjs';

/**
 * @template {{
 * [x: string]: ''
 * }} Slots
 * @template {keyof NonNullable<Slots>} SlotName
 * @template {{
 * [x: string]: string
 * }} defaultProps
 * @template {keyof NonNullable<defaultProps>} Prop
 */
export class WebComponent {
	/**
	 * @private
	 */
	static tagIndex = 0;
	/**
	 * @private
	 */
	static generateTag = () => {
		return (WebComponent.tagIndex++).toString();
	};
	/**
	 * @private
	 * @param {string} string
	 * @returns {string}
	 */
	static validateTag = (string) => {
		return string
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-+/g, '-');
	};
	/**
	 * @type {string}
	 */
	static globalStyle;
	/**
	 * @private
	 */
	static callbackHandlerIdentifier = 'atla-as-cb';
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
	callbackHandler = {};
	/**
	 * @type {string}
	 */
	tagName;
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
	tag = ({ props, slots, attributes, connectedCallback } = {}) => {
		const element = document.createElement(this.validatedTag);
		for (const prop in props) {
			element.setAttribute(prop, props[prop]);
		}
		for (const slotName in slots) {
			const slot = slots[slotName];
			slot.setAttribute('slot', slotName);
			element.append(slot);
		}
		for (const attributeName in attributes) {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
		const attr = spaHelper.attributeIndexGenerator() ?? '';
		if (connectedCallback) {
			element.setAttribute(WebComponent.callbackHandlerIdentifier, attr);
			this.callbackHandler[attr] = {
				connected: connectedCallback,
			};
		}
		return {
			element,
			string: element.outerHTML,
			// @ts-ignore
			shadowRoot: element.shadowRoot,
			attr,
		};
	};
	/**
	 * @private
	 * @type {string}
	 */
	validatedTag;
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
	constructor(options) {
		const {
			defaultProps = {},
			lifecycle,
			tagPrefix = 'hf-wc',
			tagName = WebComponent.generateTag(),
			importStyles = [],
			slots,
		} = options;
		this.tagName = tagName;
		this.validatedTag = WebComponent.validateTag(`${tagPrefix}-${tagName}`);
		const thisCustomTag = this;
		let htmlTemplate;
		/**
		 * @type {connectedCallbackType}
		 */
		let connectedCallback;
		/**
		 * @type {voidFnType}
		 */
		let disconnectedCallback;
		/**
		 * @type {attributeChangedCallbackType}
		 */
		let attributeChangedCallback;
		/**
		 * @type {voidFnType}
		 */
		let adoptedCallback;
		let observedAttributes = [];
		for (const prop in defaultProps) {
			observedAttributes.push(prop);
		}
		/**
		 * @type {Record.<Prop, Let<string>>}}
		 */
		// @ts-ignore
		customElements.define(
			this.validatedTag,
			class extends HTMLElement {
				/**
				 * @type {HTMLTemplateElement}
				 */
				template;
				curentScope = spaHelper.currentDocumentScope;
				/**
				 * @type {Record.<Prop, Let<string>>}
				 */
				// @ts-ignore
				reactiveProps = {};
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
				}
				static get observedAttributes() {
					return observedAttributes;
				}
				connectedCallback() {
					this.shadowRoot = this.attachShadow({ mode: 'open' });
					this.template = document.createElement('template');
					spaHelper.currentDocumentScope = this.shadowRoot;
					for (const prop in defaultProps) {
						this.reactiveProps[prop.toString()] = new Let('');
					}
					const connectedCallbackOptions = {
						/**
						 * @param {SlotName} slotName
						 * @returns
						 */
						createSlot: (slotName) => {
							return /* HTML */ `<slot name="${slotName.toString()}"></slot>`;
						},
						reactiveProps: this.reactiveProps,
						shadowRoot: this.shadowRoot,
						propsManipulator: (propName) => {
							const this_ = this;
							const propName_ = propName.toString();
							return {
								get value() {
									return this_.getAttribute(propName_) ?? '';
								},
								set value(newValue) {
									this.reactiveProps[propName].value = newValue;
									this_.setAttribute(propName_, newValue);
								},
							};
						},
						thisElement: this,
					};
					({ htmlTemplate, connectedCallback = () => {} } =
						lifecycle(connectedCallbackOptions));
					let importStyles_ = [`@import url(${WebComponent.globalStyle});`];
					if (importStyles) {
						for (let i = 0; i < importStyles.length; i++) {
							const style = importStyles[i];
							importStyles_.push(`@import url(${style});`);
						}
						htmlTemplate = /* HTML */ `<style>
								${importStyles_.join('')}
							</style>
							${htmlTemplate}`;
					}
					this.template.innerHTML = htmlTemplate;
					this.shadowRoot.appendChild(this.template.content.cloneNode(true));
					const options = connectedCallback() ?? {};
					if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
						const CBS = thisCustomTag.callbackHandler[identifier];
						const options = CBS.connected(connectedCallbackOptions);
						if (options) {
							({
								disconnectedCallback: CBS.disconnected,
								adoptedCallback: CBS.adopted,
								attributeChangedCallback: CBS.attributeChanged,
							} = options);
						}
					}
					({
						disconnectedCallback = () => {},
						attributeChangedCallback = () => {},
						adoptedCallback = () => {},
					} = options);
					for (const prop in defaultProps) {
						if (this.hasAttribute(prop)) {
							this.setAttribute(prop, this.getAttribute(prop) ?? '');
							continue;
						}
						this.setAttribute(prop, defaultProps[prop]);
					}
					spaHelper.currentDocumentScope = this.curentScope;
				}
				/**
				 * @param {Prop} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					spaHelper.currentDocumentScope = this.shadowRoot;
					if (attributeChangedCallback) {
						if (propName in this.reactiveProps) {
							this.reactiveProps[propName].value = newValue;
							attributeChangedCallback({ propName, oldValue, newValue });
						}
					}
					if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
						if (thisCustomTag.callbackHandler[identifier].adopted) {
							thisCustomTag.callbackHandler[identifier].adopted();
						}
					}
					spaHelper.currentDocumentScope = this.curentScope;
				}
				async disconnectedCallback() {
					spaHelper.currentDocumentScope = this.shadowRoot;
					if (disconnectedCallback) {
						for (const prop in this.reactiveProps) {
							this.reactiveProps[prop].removeAll$();
							delete this.reactiveProps[prop];
						}
						disconnectedCallback();
					}
					if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
						if (thisCustomTag.callbackHandler[identifier].disconnected) {
							thisCustomTag.callbackHandler[identifier].disconnected();
						}
					}
					spaHelper.currentDocumentScope = this.curentScope;
				}
				adoptedCallback() {
					spaHelper.currentDocumentScope = this.shadowRoot;
					if (adoptedCallback) {
						adoptedCallback();
					}
					if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
						if (thisCustomTag.callbackHandler[identifier].adopted) {
							thisCustomTag.callbackHandler[identifier].adopted();
						}
					}
					spaHelper.currentDocumentScope = this.curentScope;
				}
			}
		);
	}
}
