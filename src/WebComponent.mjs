// @ts-check

import { Let } from './Let.mjs';
import { Ping } from './Ping.mjs';
import { spaHelper } from './spaHelper.mjs';

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
	 * @typedef {Object} callbackHandlerValue
	 * @property {tagOptionCCB} connectedCallback
	 * @property {(options:{observedAttributeName:string,oldValue:string,newValue:string})=>void} [attributeChangedCallback]
	 * @property {()=>void} [adoptedCallback]
	 * @property {void|(()=>void)} [disconnectedCallback]
	 */
	/**
	 * @private
	 * @type {{
	 * [callbackId:string]:callbackHandlerValue
	 * }}
	 */
	callbackHandler = {};
	/**
	 * @typedef {Object} tagOptionCCBReturns
	 * @property {function(): void} [disconnectedCallback] - A callback function invoked when the element is disconnected from the document.
	 * @property {(options:{observedAttributeName:string,oldValue:string,newValue:string})=> void} [attributeChangedCallback] - A callback function invoked when an attribute of the element is changed.
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
	tag = ({ observedAttributes, slots, attributes, connectedCallback } = {}) => {
		const element = document.createElement(this.tagName);
		for (const prop in observedAttributes) {
			element.setAttribute(prop, observedAttributes[prop]);
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
				connectedCallback: connectedCallback,
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
	 * @type {string}
	 */
	tagName;
	/**
	 * @typedef {()=>void} voidFnType
	 * @typedef {(options:{observedAttributeName:observedAttribute, oldValue:string, newValue:string})=>void} attributeChangedCallbackType
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
	constructor(options) {
		const {
			observedAttributes = {},
			lifecycle,
			tagPrefix = 'atla-as-wc',
			tagName = WebComponent.generateTag(),
			importStyles = [],
			slots,
			extendsElement = HTMLElement,
		} = options;
		this.tagName = WebComponent.validateTag(`${tagPrefix}-${tagName}`);
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
		let observedAttributes_ = [];
		for (const prop in observedAttributes) {
			observedAttributes_.push(prop);
		}
		customElements.define(
			this.tagName,
			class CustomTag extends extendsElement {
				/**
				 * @type {HTMLTemplateElement}
				 */
				template;
				/**
				 * @type {Record.<observedAttribute, Let<string>>}
				 */
				// @ts-ignore
				observedAttributesSignal = {};
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
				}
				static get observedAttributes() {
					return observedAttributes_;
				}
				/**
				 * @param {string} style
				 * @returns {string}
				 */
				static generateLinkCSS = (style) => {
					return `<link rel="stylesheet" href="${style}">`;
				};
				connectedCallback() {
					this.shadowRoot = this.attachShadow({ mode: 'open' });
					this.template = document.createElement('template');
					Ping.manualScope({
						runCheckAtFirst: true,
						documentScope: this.shadowRoot,
						scopedCallback: async () => {
							for (const prop in observedAttributes) {
								this.observedAttributesSignal[prop.toString()] = new Let('');
							}
							const connectedCallbackOptions = {
								/**
								 * @param {SlotName} slotName
								 * @returns
								 */
								createSlot: (slotName) => {
									return /* HTML */ `<slot name="${slotName.toString()}"></slot>`;
								},
								observedAttributesSignal: this.observedAttributesSignal,
								shadowRoot: this.shadowRoot,
								thisElement: this,
							};
							({ htmlTemplate, connectedCallback = () => {} } =
								lifecycle(connectedCallbackOptions));
							let importedStyles = [];
							if (WebComponent.globalStyle) {
								importedStyles.push(
									CustomTag.generateLinkCSS(WebComponent.globalStyle)
								);
							}
							if (importStyles) {
								for (let i = 0; i < importStyles.length; i++) {
									const style = importStyles[i];
									importedStyles.push(CustomTag.generateLinkCSS(style));
								}
								htmlTemplate = /* HTML */ `<div
										style="display: none;"
										aria-hidden="true"
									>
										${importedStyles.join('')}
									</div>
									${htmlTemplate}`;
							}
							this.template.innerHTML = htmlTemplate;
							this.shadowRoot.appendChild(this.template.content.cloneNode(true));
							const options = connectedCallback() ?? {};
							if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
								const identifier =
									this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
								const CBS = thisCustomTag.callbackHandler[identifier];
								const options = CBS.connectedCallback(connectedCallbackOptions);
								if (options) {
									({
										disconnectedCallback: CBS.disconnectedCallback,
										adoptedCallback: CBS.adoptedCallback,
										attributeChangedCallback: CBS.attributeChangedCallback,
									} = options);
								}
							}
							if (options) {
								({
									disconnectedCallback = () => {},
									attributeChangedCallback = () => {},
									adoptedCallback = () => {},
								} = options);
							}
							for (const prop in observedAttributes) {
								if (this.hasAttribute(prop)) {
									this.setAttribute(prop, this.getAttribute(prop) ?? '');
									continue;
								}
								this.setAttribute(prop, observedAttributes[prop]);
							}
						},
					});
				}
				/**
				 * @param {observedAttribute} observedAttributeName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(observedAttributeName, oldValue, newValue) {
					Ping.manualScope({
						runCheckAtFirst: true,
						documentScope: this.shadowRoot,
						scopedCallback: async () => {
							if (attributeChangedCallback) {
								if (observedAttributeName in this.observedAttributesSignal) {
									this.observedAttributesSignal[observedAttributeName].value =
										newValue;
									attributeChangedCallback({
										observedAttributeName,
										oldValue,
										newValue,
									});
								}
							}
							if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
								const identifier =
									this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
								if (
									thisCustomTag.callbackHandler[identifier]
										.attributeChangedCallback
								) {
									thisCustomTag.callbackHandler[
										identifier
									].attributeChangedCallback({
										observedAttributeName,
										oldValue,
										newValue,
									});
								}
							}
						},
					});
				}
				async disconnectedCallback() {
					Ping.manualScope({
						runCheckAtFirst: true,
						documentScope: this.shadowRoot,
						scopedCallback: async () => {
							if (disconnectedCallback) {
								for (const prop in this.observedAttributesSignal) {
									this.observedAttributesSignal[prop].removeAll$();
									delete this.observedAttributesSignal[prop];
								}
								disconnectedCallback();
							}
							if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
								const identifier =
									this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
								if (
									thisCustomTag.callbackHandler[identifier].disconnectedCallback
								) {
									thisCustomTag.callbackHandler[
										identifier
									].disconnectedCallback();
								}
							}
						},
					});
				}
				adoptedCallback() {
					Ping.manualScope({
						runCheckAtFirst: true,
						documentScope: this.shadowRoot,
						scopedCallback: async () => {
							if (adoptedCallback) {
								adoptedCallback();
							}
							if (this.hasAttribute(WebComponent.callbackHandlerIdentifier)) {
								const identifier =
									this.getAttribute(WebComponent.callbackHandlerIdentifier) ?? '';
								if (thisCustomTag.callbackHandler[identifier].adoptedCallback) {
									thisCustomTag.callbackHandler[identifier].adoptedCallback();
								}
							}
						},
					});
				}
			}
		);
	}
}
