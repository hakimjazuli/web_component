// @ts-check

import {
	Let as Let_,
	Derived as Derived_,
	OnViewPort as OnViewPort_,
	$ as $_,
	Ping as Ping_,
} from '@html_first/simple_signal';

class spaHelper {
	/**
	 * @private
	 */
	static generateUniqueString() {
		const timestamp = Date.now();
		const randomPart = Math.floor(Math.random() * 1_000_000);
		return `${timestamp}${randomPart}`;
	}
	static attr = '';
	/**
	 * @return {string}
	 */
	static attributeIndexGenerator = () => {
		return (this.attr = `atla-as-${this.generateUniqueString()}`);
	};
	/**
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	static currentDocumentScope = document;
}

/**
 * @template V
 * @extends {Let_<V>}
 */
export class Let extends Let_ {
	/**
	 * @param {V} value
	 * @param {import('@html_first/simple_signal').documentScope} [documentScope]
	 */
	constructor(value, documentScope = spaHelper.currentDocumentScope) {
		super(value, spaHelper.attributeIndexGenerator(), documentScope);
		this.documentScope = documentScope;
	}
	/** @type {string} */
	attr = spaHelper.attr;
}

/**
 * - side effect of `Let` / `Derived`;
 */
export const $ = $_;

/**
 * - trigger based callback integrated to the internal queue handler;
 */
export const Ping = Ping_;

/**
 * - signal based reactivity, wich value are derived from `Let<T>.value`;
 * @template V
 * @extends {Derived_<V>}
 */
export class Derived extends Derived_ {
	attr = spaHelper.attr;
	/**
	 * @param {()=>Promise<V>} asyncCallback
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 */
	constructor(asyncCallback, documentScope = spaHelper.currentDocumentScope) {
		super(asyncCallback, spaHelper.attributeIndexGenerator(), documentScope);
	}
}

/**
 * - viewport observer;
 */
export class OnViewPort extends OnViewPort_ {
	/**
	 * @param {(element:IntersectionObserverEntry['target'])=>Promise<void>} OnViewCallback
	 * @param {(element:IntersectionObserverEntry['target'], unObserve:()=>void)=>Promise<void>} [onExitingViewport]
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 * undefined: will automatically fires unObserve callback;
	 */
	constructor(OnViewCallback, onExitingViewport, documentScope = spaHelper.currentDocumentScope) {
		super(
			spaHelper.attributeIndexGenerator(),
			OnViewCallback,
			onExitingViewport,
			documentScope
		);
	}
}

/**
 * - signal based query parameter;
 */
class QueryRouter {
	/**
	 * @type {QueryRouter}
	 */
	static __;
	constructor() {
		if (QueryRouter.__ instanceof QueryRouter) {
			return;
		}
		QueryRouter.__ = this;
		window.addEventListener('click', QueryRouter.elementCheck);
	}
	/**
	 * @private
	 * Handles click events and checks if the click target or its ancestors match specific selectors.
	 * @param {MouseEvent} event - The click event.
	 */
	static elementCheck = (event) => {
		/** @type {HTMLElement | null} */
		let targetElement = null;
		const target = /** @type {HTMLElement | null} */ (event.target);
		if (target && (target.matches('a') || target.matches('button[type="submit"]'))) {
			targetElement = target;
		} else {
			let currentElement = target;
			while (currentElement) {
				if (currentElement instanceof ShadowRoot) {
					break;
				}
				if ('matches' in currentElement) {
					if (currentElement.matches('a')) {
						targetElement = currentElement;
						break;
					}
					if (currentElement.matches('button[type="submit"]')) {
						const form = currentElement.closest('form');
						if (form) {
							targetElement = currentElement;
							break;
						}
					}
				}
				currentElement = currentElement.parentElement;
			}
		}
		if (!targetElement) {
			return;
		}
		if (targetElement instanceof HTMLAnchorElement) {
			event.preventDefault();
			QueryRouter.handleUrl(new URL(targetElement.href ?? ''));
			return;
		}
		if (targetElement instanceof HTMLButtonElement) {
			event.preventDefault();
			const form = targetElement.closest('form');
			if (!form || !form.action) {
				return;
			}
			QueryRouter.handleUrl(new URL(form.action));
			return;
		}
	};
	/**
	 * @private
	 * @param {URL} url
	 */
	static handleUrl = (url) => {
		const queryParams = new URLSearchParams(url.search);
		for (const [key, value] of queryParams.entries()) {
			if (key in LetURL.queryList) {
				LetURL.queryList[key].value = value;
			}
		}
	};
}

export class LetURL {
	/**
	 * @type {{
	 * [name:string]: Let_<string>
	 * }}
	 */
	static queryList = {};
	/**
	 * @param {string} paramName
	 * @param {string} paramValue
	 */
	static updateQueryParams = (paramName, paramValue) => {
		const url = new URL(window.location.href);
		url.searchParams.set(paramName, paramValue);
		history.pushState(null, '', url.toString());
	};
	/**
	 * query
	 * @type {Let_<string>}
	 */
	query;
	/**
	 * @private
	 * @type {string}
	 */
	paramName;
	/**
	 * @private
	 * @type {Ping_|null}
	 */
	queryChangePing;
	/**
	 * @param {{
	 * name:string,
	 * value?:string,
	 * onRouteChangedCallback?:(currentQueryValue:string)=>Promise<void>
	 * }} options
	 */
	constructor({ name, value = undefined, onRouteChangedCallback = async () => {} }) {
		this.paramName = name;
		if (value === undefined) {
			const url = new URL(window.location.href);
			value = url.searchParams.get(name) || '';
		}
		this.query = new Let_(value);
		LetURL.queryList[name] = this.query;
		this.queryChangePing = new Ping_(async (first) => {
			if (first) {
				return;
			}
			onRouteChangedCallback(this.query.value);
		});
		new $(async () => {
			const val = this.query.value;
			LetURL.updateQueryParams(name, val);
			if (this.queryChangePing) {
				this.queryChangePing.ping();
			}
		});
	}
	unSub = () => {
		this.query.removeAll$();
		delete LetURL.queryList[this.paramName];
		this.queryChangePing = null;
	};
}

export class query {
	/**
	 * @param {{attr:string}} letInstance
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 */
	constructor(letInstance, documentScope) {
		this.element = documentScope.querySelector(`[${letInstance.attr}]`);
	}
	/**
	 * @param {(HTMLElement:HTMLElement)=>void} callback
	 * @param {boolean} [handleEvenWhenFalsy]
	 * - true: for checking purposes
	 */
	handle = (callback, handleEvenWhenFalsy = false) => {
		if (this.element instanceof HTMLElement || !handleEvenWhenFalsy) {
			// @ts-ignore
			callback(this.element);
		}
	};
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
	 * @private
	 */
	static tagIndex = 0;
	/**
	 * @private
	 */
	static generateTag = () => {
		return (CustomTag.tagIndex++).toString();
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
		if (connectedCallback) {
			const attr = spaHelper.attributeIndexGenerator();
			element.setAttribute(CustomTag.callbackHandlerIdentifier, attr);
			this.callbackHandler[attr] = {
				connected: connectedCallback,
			};
		}
		return {
			element,
			string: element.outerHTML,
			// @ts-ignore
			shadowRoot: element.shadowRoot,
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
			tagName = CustomTag.generateTag(),
			importStyles = [],
			slots,
		} = options;
		this.tagName = tagName;
		this.validatedTag = CustomTag.validateTag(`${tagPrefix}-${tagName}`);
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
					let importStyles_ = [`@import url(${CustomTag.globalStyle});`];
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
					if (this.hasAttribute(CustomTag.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(CustomTag.callbackHandlerIdentifier) ?? '';
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
					if (this.hasAttribute(CustomTag.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(CustomTag.callbackHandlerIdentifier) ?? '';
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
					if (this.hasAttribute(CustomTag.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(CustomTag.callbackHandlerIdentifier) ?? '';
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
					if (this.hasAttribute(CustomTag.callbackHandlerIdentifier)) {
						const identifier =
							this.getAttribute(CustomTag.callbackHandlerIdentifier) ?? '';
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

/**
 * - document.createElement` helper
 * - as well as property and attribute setter
 */
export class SimpleElement {
	/**
	 * @param {{
	 * tagName:string,
	 * attributeNProperty?: {
	 * [attrNameNPropName:string]:string
	 * }}} options
	 */
	constructor({ tagName, attributeNProperty = {} }) {
		this.element = document.createElement(tagName);
		for (const attrNameNPropName in attributeNProperty) {
			try {
				if (!(attrNameNPropName in this.element)) {
					throw '';
				}
				if (this.element[attrNameNPropName] != attributeNProperty[attrNameNPropName]) {
					this.element[attrNameNPropName] = attributeNProperty[attrNameNPropName];
				}
			} catch (error) {
				if (
					attributeNProperty[attrNameNPropName] !=
						this.element.getAttribute(attrNameNPropName) ??
					''
				) {
					this.element.setAttribute(
						attrNameNPropName,
						attributeNProperty[attrNameNPropName]
					);
				}
			}
		}
		this.string = this.element.outerHTML;
	}
}

/**
 * - handling conditional string as `innerHTML`;
 *   > -   `WARNING!!!`: you better make sure the data is safe;
 */
export class If {
	/**
	 * @private
	 */
	static IfTag = new CustomTag({
		tagName: 'if',
		lifecycle: () => {
			return {
				htmlTemplate: '',
			};
		},
	});
	/**
	 * @param {()=>Promise<string>} stringLogic
	 */
	static tag = (stringLogic) => {
		const elem = If.IfTag.tag({
			connectedCallback: ({ shadowRoot }) => {
				const derivedString = new Derived(stringLogic);
				new $(async () => {
					shadowRoot.innerHTML = derivedString.value;
				});
				return {
					disconnectedCallback: () => {
						derivedString.removeAll$();
					},
				};
			},
		});
		return elem;
	};
}

/**
 * - handling looped tag
 * @template {{
 * [x: string]: ''
 * }} ListTemplate
 */
export class For extends CustomTag {
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
	constructor({ listTemplate, data, childElement, addParentElement }) {
		super({
			lifecycle: ({ shadowRoot }) => {
				return {
					htmlTemplate: '',
					connectedCallback: () => {
						this.listTemplate = listTemplate;
						this.shadowRoot = shadowRoot;
						this.parentElement = shadowRoot;
						if (addParentElement) {
							shadowRoot.appendChild(addParentElement);
							const parent_ = shadowRoot.children[1];
							if (parent_ instanceof HTMLElement) {
								this.parentElement = parent_;
							}
						}
						this.data = new Let([]);
						this.childElement = childElement;
						const check = new $(async () => {
							this.overwriteData(data.value);
						});
						return {
							disconnectedCallback: () => {
								data.remove$(check);
								this.data.removeAll$();
							},
						};
					},
				};
			},
		});
	}
	/**
	 * @private
	 * @type {ShadowRoot}
	 */
	shadowRoot;
	/**
	 * @private
	 * @type {ShadowRoot|HTMLElement}
	 */
	parentElement;
	/**
	 * @type {derivedListType}
	 */
	data;
	/**
	 * @param {Array<Record<keyof NonNullable<ListTemplate>, string>>} overwriteData
	 */
	overwriteData = (overwriteData) => {
		const realData = this.data.value;
		for (let i = 0; i < overwriteData.length; i++) {
			const newData_ = overwriteData[i];
			const realData_ = realData[i];
			if (!realData_) {
				this.addChild(newData_);
			} else {
				this.editData(newData_, i);
			}
		}
		for (let i = overwriteData.length; i < realData.length; i++) {
			let index = i;
			if (this.parentElement instanceof ShadowRoot) {
				index = index + 1;
			}
			this.removeChild(index);
		}
	};
	/**
	 * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
	 * @param {number} index
	 */
	editData = (newData, index) => {
		const thisData = this.data.value[index];
		for (const attr in newData) {
			if (!(attr in this.listTemplate)) {
				continue;
			}
			const thisDataAttr = thisData[attr];
			if (thisDataAttr.value != newData[attr]) {
				thisDataAttr.value = newData[attr];
			}
		}
	};
	/**
	 * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
	 */
	addChild = (newData) => {
		const generateData = {};
		const i = this.data.value.length + 1;
		for (const attr in newData) {
			if (!(attr in this.listTemplate)) {
				continue;
			}
			const attrString = attr.toString();
			generateData[attrString] = new Let(newData[attr]);
			new $(async (first) => {
				const value = generateData[attrString].value;
				if (first) {
					return;
				}
				this.data.value[i][attr] = new Let(value);
			});
		}
		// @ts-ignore by pass from data construction
		this.data.value.push(generateData);
		// @ts-ignore by pass from data construction
		const childElement = this.generateChild(generateData);
		this.parentElement.append(childElement);
	};
	/**
	 * @param {number|NaN|Let<string>} indexOrSignal
	 */
	removeChild = (indexOrSignal) => {
		if (indexOrSignal instanceof Let) {
			const child = this.shadowRoot.querySelector(`[${indexOrSignal.attr}]`);
			if (!child || !child.parentElement) {
				indexOrSignal = NaN;
			} else {
				indexOrSignal = Array.prototype.indexOf.call(child.parentElement.children, child);
			}
			if (typeof indexOrSignal !== 'number' || Number.isNaN(indexOrSignal)) {
				return;
			}
		}
		const realdData = this.data;
		const realData_ = realdData[indexOrSignal];
		for (const attribute in realData_) {
			if (!(attribute in this.listTemplate)) {
				continue;
			}
			const tracker = realData_[attribute];
			if (tracker instanceof Let) {
				tracker.removeAll$();
			}
		}
		if (this.parentElement instanceof ShadowRoot) {
			this.parentElement.children[indexOrSignal + 1].remove();
		} else {
			this.parentElement.children[indexOrSignal].remove();
		}
		realdData.value.splice(indexOrSignal, 1);
	};
	/**
	 * @private
	 * - not a static method, so `ListTemplate` can be used to typehint;
	 * @param {Record<keyof NonNullable<ListTemplate>, Let<string>>} data
	 * @returns {HTMLElement|Node}
	 */
	generateChild = (data) => {
		const childElement_ = this.childElement.cloneNode(true);
		for (const attributeName in data) {
			if (!(attributeName in this.listTemplate)) {
				continue;
			}
			const attributeData = data[attributeName];
			if (childElement_ instanceof HTMLElement) {
				childElement_.setAttribute(attributeData.attr, attributeName);
				const attributeName_ = attributeName.toString();
				try {
					if (!(attributeName in childElement_)) {
						throw '';
					}
					if (childElement_[attributeName_] != attributeData.value) {
						childElement_[attributeName_] = attributeData.value;
					}
				} catch (error) {
					if (attributeData.value != childElement_.getAttribute(attributeName_) ?? '') {
						childElement_.setAttribute(attributeName_, attributeData.value);
					}
				}
			}
		}
		return childElement_;
	};
}

/**
 * Render Helper to `document.body`
 */
export class Render {
	/**
	 * render string to element.innerHTML that fit `[${attributeName}]` selector
	 * @param {{
	 * attributeName:string,
	 * rootTag:CustomTag,
	 * useSPARouter?:boolean,
	 * globalStyle_?:string,
	 * }} options
	 */
	constructor({ attributeName, rootTag, useSPARouter = false, globalStyle_ = undefined }) {
		if (globalStyle_) {
			CustomTag.globalStyle = globalStyle_;
		}
		window.addEventListener('load', () => {
			const app = document.body.querySelector(`[${attributeName}]`);
			if (!app) {
				console.warn({
					attributeName,
					problem: `[${attributeName}] is not exist in document.body`,
				});
				return;
			}
			app.innerHTML = rootTag.tag().string;
			if (useSPARouter) {
				new QueryRouter();
			}
		});
	}
}
