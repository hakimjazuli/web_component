// @ts-check

import {
	Let as Let_,
	Derived as Derived_,
	OnViewPort as OnViewPort_,
} from '@html_first/simple_signal';

let tag_index = 1;

const generateTag = () => {
	let tag_index_ = tag_index;
	let remainder = (tag_index_ - 1) % 26;
	tag_index_ = Math.floor((tag_index_ - 1) / 26);
	const result = String.fromCharCode(97 + remainder) + '';
	tag_index++;
	return result;
};

/**
 * @param {string} string
 * @returns {string}
 */
const validateHtmlTagAttrName = (string) => {
	return string
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-+/g, '-');
};

const spaHelper = new (class {
	/**
	 * attribute index
	 * @private
	 * @type {Number}
	 */
	AI = 1;
	attr = '';
	/**
	 * attribute index
	 * @return {string}
	 */
	AG = () => {
		return (this.attr = `atla-as-attr-${this.AI++}`);
	};
	/**
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	currentDocumentScope = document;
})();

/**
 * @template V
 */
export class Let extends Let_ {
	/**
	 * @param {V} value
	 */
	constructor(value) {
		super(value, spaHelper.AG(), spaHelper.currentDocumentScope);
	}
	attr = spaHelper.attr;
	get value() {
		return super.value;
	}
	set value(v) {
		super.value = v;
	}
}

/**
 * @template V
 */
export class Derived extends Derived_ {
	attr = spaHelper.attr;
	/**
	 * @param {()=>Promise<V>} asyncCallback
	 */
	constructor(asyncCallback) {
		super(asyncCallback, spaHelper.AG(), spaHelper.currentDocumentScope);
	}
	get value() {
		return super.value;
	}
	set value(v) {
		super.value = v;
	}
}

export class OnViewPort extends OnViewPort_ {
	/**
	 * @param {(element:IntersectionObserverEntry['target'])=>Promise<void>} OnViewCallback
	 * @param {(element:IntersectionObserverEntry['target'], unObserve:()=>void)=>Promise<void>} [onExitingViewport]
	 * undefined: will automatically fires unObserve callback;
	 */
	constructor(OnViewCallback, onExitingViewport) {
		super(spaHelper.AG(), OnViewCallback, onExitingViewport, spaHelper.currentDocumentScope);
	}
}

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
export class CustomTag {
	/**
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement|Element>
	 * }} [options]
	 * @returns {{
	 * element:HTMLElement|Element,
	 * string:string
	 * }}
	 */
	make = (options) => {
		const element = document.createElement(this.TNV);
		if (options) {
			const { props, slots } = options;
			for (const prop in props) {
				element.setAttribute(prop, props[prop]);
			}
			for (const slotName in slots) {
				const childElement = slots[slotName];
				childElement.setAttribute('slot', slotName);
				element.appendChild(childElement);
			}
		}
		return {
			element,
			string: element.outerHTML,
		};
	};
	/**
	 * @private
	 * @type {string}
	 */
	TNV;
	/**
	 * @typedef CustomElementParameters
	 * @property {defaultProps} defaultProps
	 * @property {(
	 * create_slot:(slot_name:SlotName, additional_attribute?:Record.<string,string>)=>string,
	 * )=>{
	 * htmlTemplate: string,
	 * connectedCallback:(shadwRoot:ShadowRoot,props_manipulator:(props: Prop) => { value: string; })=>{
	 * disconnectedCallback:()=>void,
	 * attributeChangedCallback:(propName:Prop, oldValue:string, newValue:string)=>void,
	 * adoptedCallback?:()=>void,
	 * },
	 * }} lifecycle
	 * @property {string} [tagPrefix]
	 * @property {Slots} [slots]
	 * @property {string} [tagName]
	 */
	/**
	 * @param {CustomElementParameters} options
	 */
	constructor(options) {
		const {
			defaultProps,
			lifecycle,
			tagPrefix = 'hf-wc',
			tagName = generateTag(),
			slots,
		} = options;
		this.TNV = validateHtmlTagAttrName(`${tagPrefix}-${tagName}`);
		let htmlTemplate;
		/**
		 * @type {(shadwRoot:ShadowRoot,props_manipulator:(props: Prop) => { value: string; })=>{
		 * disconnectedCallback:()=>void,
		 * attributeChangedCallback:(propName:Prop, oldValue:string, newValue:string)=>void,
		 * adoptedCallback?:()=>void,
		 * }}
		 */
		let connectedCallback;
		let disconnectedCallback;
		let attributeChangedCallback;
		let adoptedCallback;
		let observedAttributes = [];
		for (const prop in defaultProps) {
			observedAttributes.push(prop);
		}
		customElements.define(
			this.TNV,
			class extends HTMLElement {
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
					this.shadowRoot = this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					const curentScope = spaHelper.currentDocumentScope;
					spaHelper.currentDocumentScope = this.shadowRoot;
					({ htmlTemplate, connectedCallback } = lifecycle(
						(slot_name, additional_attribute) => {
							let attribute_value = [];
							for (const attributeName in additional_attribute) {
								attribute_value.push(
									`${attributeName}="${additional_attribute[attributeName]}"`
								);
							}
							return /* HTML */ `<slot
								name="${slot_name.toString()}"
								${attribute_value.join(' ')}
							></slot>`;
						}
					));
					spaHelper.currentDocumentScope = curentScope;
					template.innerHTML = htmlTemplate;
					this.shadowRoot.appendChild(template.content.cloneNode(true));
				}
				static get observedAttributes() {
					return observedAttributes;
				}
				connectedCallback() {
					({
						attributeChangedCallback,
						disconnectedCallback,
						adoptedCallback = () => {},
					} = connectedCallback(this.shadowRoot, (propName) => {
						const this_ = this;
						return {
							get value() {
								return this_.getAttribute(propName.toString()) ?? '';
							},
							set value(newValue) {
								this_.setAttribute(propName.toString(), newValue);
							},
						};
					}));
					for (const prop in defaultProps) {
						if (this.hasAttribute(prop)) {
							this.setAttribute(prop, this.getAttribute(prop) ?? '');
							continue;
						}
						this.setAttribute(prop, defaultProps[prop]);
					}
				}
				/**
				 * @param {Prop} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					if (attributeChangedCallback) {
						attributeChangedCallback(propName, oldValue, newValue);
					}
				}
				async disconnectedCallback() {
					if (disconnectedCallback) {
						disconnectedCallback();
					}
				}
				adoptedCallback() {
					if (adoptedCallback) {
						adoptedCallback();
					}
				}
			}
		);
	}
}
