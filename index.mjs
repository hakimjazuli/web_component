// @ts-check

import {
	Let as Let_,
	Derived as Derived_,
	OnViewPort as OnViewPort_,
	Lifecycle as Lifecycle_,
} from '@html_first/simple_signal';

let tagIndex = 1;

const generateTag = () => {
	let tagIndex_ = tagIndex;
	let remainder = (tagIndex_ - 1) % 26;
	tagIndex_ = Math.floor((tagIndex_ - 1) / 26);
	const result = String.fromCharCode(97 + remainder) + '';
	tagIndex++;
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
	 * @type {Number}
	 */
	AI = 0;
	attr = '';
	/**
	 * attribute index
	 * @return {string}
	 */
	AG = () => {
		return (this.attr = `atla-as-attr-${this.AI++}`);
	};
	/**
	 * reset attribute index
	 */
	RA = () => {
		this.AI = 0;
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

export class Lifecycle extends Lifecycle_ {
	/**
	 * @param { (element:HTMLElement|Element, unObserve:()=>void)=>(Promise<()=>Promise<void>>)} lifecycleCallback
	 */
	constructor(lifecycleCallback) {
		super({ [spaHelper.AG()]: lifecycleCallback }, spaHelper.currentDocumentScope);
	}
	attr = spaHelper.attr;
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
	 * create element
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement|Element>,
	 * additionalAttributes?:Record.<string, string>,
	 * }} [options]
	 * @returns {HTMLElement|Element}
	 */
	element = (options) => {
		const element = document.createElement(this.TNV);
		if (options) {
			const { props, slots, additionalAttributes } = options;
			for (const prop in props) {
				element.setAttribute(prop, props[prop]);
			}
			for (const slotName in slots) {
				const childElement = slots[slotName];
				childElement.setAttribute('slot', slotName);
				element.appendChild(childElement);
			}
			for (const attributeName in additionalAttributes) {
				element.setAttribute(attributeName, additionalAttributes[attributeName]);
			}
		}
		return element;
	};
	/**
	 * create element
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement|Element>,
	 * additionalAttributes?:Record.<string, string>,
	 * }} [options]
	 * @returns {string}
	 */
	string = (options) => {
		return this.element(options).outerHTML;
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
	 * createSlot:(slotName:SlotName)=>string,
	 * )=>{
	 * shadowRoot: string,
	 * connectedCallback:(shadwRoot:ShadowRoot,propsManipulator:(props: Prop) => { value: string; })=>{
	 * disconnectedCallback:()=>void,
	 * attributeChangedCallback:(propName:Prop, oldValue:string, newValue:string)=>void,
	 * adoptedCallback?:()=>void,
	 * },
	 * }} lifecycle
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
			defaultProps,
			lifecycle,
			tagPrefix = 'hf-wc',
			tagName = generateTag(),
			importStyles = [],
			slots,
		} = options;
		this.TNV = validateHtmlTagAttrName(`${tagPrefix}-${tagName}`);
		let htmlTemplate;
		/**
		 * @type {(shadwRoot:ShadowRoot,propsManipulator:(props: Prop) => { value: string; })=>{
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
				curentScope = spaHelper.currentDocumentScope;
				curentAttrIndex = spaHelper.AI;
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
					this.shadowRoot = this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					spaHelper.currentDocumentScope = this.shadowRoot;
					spaHelper.RA();
					({ shadowRoot: htmlTemplate, connectedCallback } = lifecycle((slotName) => {
						return /* HTML */ `<slot name="${slotName.toString()}"></slot>`;
					}));
					let importStyles_ = [];
					if (importStyles) {
						for (let i = 0; i < importStyles.length; i++) {
							const style = importStyles[i];
							importStyles_.push(`@import url('${style}');`);
						}
						htmlTemplate = /* HTML */ `
							<style>
								${importStyles_.join('')}
							</style>
							${htmlTemplate}
						`;
					}
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
					spaHelper.AI = this.curentAttrIndex;
					spaHelper.currentDocumentScope = this.curentScope;
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

export class Render {
	/**
	 * render string to element.innerHTML that fit `[${attributeName}]` selector
	 * @param {string} attributeName
	 * @param {CustomTag} customTag
	 */
	constructor(attributeName, customTag) {
		window.onload = () => {
			const app = document.body.querySelector(`[${attributeName}]`);
			if (!app) {
				console.warn({
					attributeName,
					problem: `[${attributeName}] is not exist in document.body`,
				});
				return;
			}
			app.innerHTML = customTag.string();
		};
	}
}
