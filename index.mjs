// @ts-check

import {
	Let as Let_,
	Derived as Derived_,
	OnViewPort as OnViewPort_,
	Lifecycle as Lifecycle_,
	$ as $_,
	Ping as Ping_,
} from '@html_first/simple_signal';

let tagIndex = 0;

const generateTag = () => {
	return (tagIndex++).toString();
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

export const $ = $_;
export const Ping = Ping_;

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

// @ts-ignore
let globalStyle = null;

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
	 * @type {string}
	 */
	tagName;
	/**
	 * create element
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement>,
	 * attributes?:Record.<string, string>,
	 * }} [options]
	 * @returns {HTMLElement}
	 */
	element = (options) => {
		const elem = document.createElement(this.TNV);
		if (options) {
			const { props, slots, attributes } = options;
			for (const prop in props) {
				elem.setAttribute(prop, props[prop]);
			}
			for (const slotName in slots) {
				const slot = slots[slotName];
				slot.setAttribute('slot', slotName);
				elem.append(slot);
			}
			for (const attributeName in attributes) {
				elem.setAttribute(attributeName, attributes[attributeName]);
			}
		}
		return elem;
	};
	/**
	 * create element as string
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement>,
	 * attributes?:Record.<string, string>,
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
	 * @typedef {()=>void} voidFnType
	 * @typedef {(propName:Prop, oldValue:string, newValue:string)=>void} attributeChangedCallbackType
	 * @typedef {(options:{
	 * shadowRoot:ShadowRoot,
	 * propsManipulator:(props: Prop) => { value: string },
	 * })=>(void|{
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
	 * reactiveProps: Record.<Prop, Let<string>>,
	 * createSlot:(slotName:SlotName)=>string,
	 * }
	 * )=>{
	 * shadowRoot: string,
	 * connectedCallback?: connectedCallbackType,
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
			defaultProps = {},
			lifecycle,
			tagPrefix = 'hf-wc',
			tagName = generateTag(),
			importStyles = [],
			slots,
		} = options;
		this.tagName = tagName;
		this.TNV = validateHtmlTagAttrName(`${tagPrefix}-${tagName}`);
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
		const reactiveProps = {};
		customElements.define(
			this.TNV,
			class extends HTMLElement {
				/**
				 * @type {HTMLTemplateElement}
				 */
				template;
				curentScope = spaHelper.currentDocumentScope;
				curentAttrIndex = spaHelper.AI;
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
					new Ping(async () => {
						this.shadowRoot = this.attachShadow({ mode: 'open' });
						this.template = document.createElement('template');
						spaHelper.RA();
						spaHelper.currentDocumentScope = this.shadowRoot;
						for (const prop in defaultProps) {
							reactiveProps[prop.toString()] = new Let('');
						}
						({ shadowRoot: htmlTemplate, connectedCallback = () => {} } = lifecycle({
							createSlot: (slotName) => {
								return /* HTML */ `<slot name="${slotName.toString()}"></slot>`;
							},
							reactiveProps,
						}));
						let importStyles_ = [`@import url(${globalStyle});`];
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
						const options =
							connectedCallback({
								shadowRoot: this.shadowRoot,
								propsManipulator: (propName) => {
									const this_ = this;
									return {
										get value() {
											return this_.getAttribute(propName.toString()) ?? '';
										},
										set value(newValue) {
											reactiveProps[propName].value = newValue;
											this_.setAttribute(propName.toString(), newValue);
										},
									};
								},
							}) ?? {};
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
						spaHelper.AI = this.curentAttrIndex;
						spaHelper.currentDocumentScope = this.curentScope;
					});
				}
				/**
				 * @param {Prop} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					if (attributeChangedCallback) {
						reactiveProps[propName].value = newValue;
						attributeChangedCallback(propName, oldValue, newValue);
					}
				}
				async disconnectedCallback() {
					new Ping(async () => {
						if (disconnectedCallback) {
							for (const prop in reactiveProps) {
								reactiveProps[prop].removeAll$();
								delete reactiveProps[prop];
							}
							disconnectedCallback();
						}
					});
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

export class For {
	attr = spaHelper.AG();
	/**
	 * document scope
	 * @private
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	DS;
	/**
	 * @param {string|CustomTag} childTag
	 * - string: valid html tag
	 * - CustomTag: CustomTag instance;
	 * @param {Let<{[attributeName:string]:string}[]>} data
	 */
	constructor(childTag, data) {
		if (childTag instanceof CustomTag) {
			this.CT = childTag.tagName;
		} else {
			this.CT = childTag;
		}
		this.DS = spaHelper.currentDocumentScope;
		new $_(async () => {
			const data_ = data.value;
			this.R(data_);
		});
	}
	/**
	 * childTag
	 * @private
	 */
	CT;
	/**
	 * trim child
	 * @private
	 * @param {HTMLElement|Element|ShadowRoot} targetElement
	 * @param {number} n
	 */
	static TC = (targetElement, n) => {
		const children = targetElement.children;
		const excess = children.length - n;
		if (excess > 0) {
			for (let i = children.length - 1; i >= n; i--) {
				targetElement.removeChild(children[i]);
			}
		}
	};
	/**
	 * render
	 * @private
	 * @param {{[key:string]:string}[]} data
	 */
	R = (data) => {
		const targetElement = this.DS.querySelector(`[${this.attr}]`);
		if (!targetElement) {
			return;
		}
		let childTag = this.CT;
		const children = targetElement.childNodes;
		const dataLength = data.length;
		For.TC(targetElement, dataLength);
		const childElement = document.createElement(childTag);
		for (let i = 0; i < data.length; i++) {
			const child = children[i];
			const data_ = data[i];
			if (child && child instanceof HTMLElement) {
				for (const propName in data_) {
					try {
						if (!(propName in child)) {
							throw '';
						}
						if (child[propName] != data_[propName]) {
							child[propName] = data_[propName];
						}
					} catch (error) {
						if (data_[propName] != child.getAttribute(propName) ?? '') {
							child.setAttribute(propName, data_[propName]);
						}
					}
				}
				continue;
			}
			const childElement_ = childElement.cloneNode();
			if (!(childElement_ instanceof HTMLElement)) {
				continue;
			}
			for (const attributeName in data_) {
				try {
					if (!(attributeName in childElement_)) {
						throw '';
					}
					childElement_[attributeName] = data_[attributeName];
					continue;
				} catch (error) {
					if (attributeName == '') {
						console.warn({
							childElement: childElement_,
							attributeName,
							message: "doesn't have target",
						});
						continue;
					}
					childElement_.setAttribute(attributeName, data_[attributeName]);
				}
			}
			targetElement.appendChild(childElement_);
		}
	};
}

export class Render {
	/**
	 * render string to element.innerHTML that fit `[${attributeName}]` selector
	 * @param {string} attributeName
	 * @param {CustomTag} customTag
	 */
	constructor(attributeName, customTag, globalStyle_ = undefined) {
		if (globalStyle_) {
			globalStyle = globalStyle_;
		}
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
