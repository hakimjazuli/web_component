// @ts-check

import {
	Let as Let_,
	Derived as Derived_,
	OnViewPort as OnViewPort_,
	$ as $_,
	Ping as Ping_,
} from '@html_first/simple_signal';

const spaHelper = new (class {
	/**
	 * @type {Number}
	 */
	attributeIndex = 0;
	attr = '';
	/**
	 * @return {string}
	 */
	attributeIndexGenerator = () => {
		return (this.attr = `atla-as-attr-${this.attributeIndex++}`);
	};
	resetAttrIndex = () => {
		this.attributeIndex = 0;
	};
	/**
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	currentDocumentScope = document;
})();

/**
 * - signal based reactivity;
 * @template V
 */
export class Let extends Let_ {
	/**
	 * @param {V} value
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 */
	constructor(value, documentScope = spaHelper.currentDocumentScope) {
		super(value, spaHelper.attributeIndexGenerator(), documentScope);
		this.documentScope = documentScope;
	}
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
	static globalStyle;
	/**
	 * @type {string}
	 */
	tagName;
	/**
	 * @typedef {(options:{
	 * propsManipulator:(props: Prop) => { value: string },
	 * reactiveProps: Record.<Prop, Let<string>>,
	 * shadowRoot:ShadowRoot,
	 * thisElement:HTMLElement,})=>void|(()=>void)
	 * } elementCreateConnectedCallbackType
	 */
	/**
	 * @private
	 * @type {elementCreateConnectedCallbackType}
	 */
	elementCCB;
	/**
	 * @type {voidFnType}
	 */
	elementDCB;
	/**
	 * @typedef {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement>,
	 * attributes?:Record.<string, string>,
	 * connectedCallback?:elementCreateConnectedCallbackType}} elementCreateOptionType
	 * - connectedCallback: use this to add aditional (dis)connected callback
	 * > - usefull for attaching eventListener and removing it;
	 */
	/**
	 * create element
	 * @param {elementCreateOptionType} [options]
	 * @returns {HTMLElement}
	 */
	element = ({ props, slots, attributes, connectedCallback } = {}) => {
		const elem = document.createElement(this.validatedTag);
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
		if (connectedCallback) {
			this.elementCCB = connectedCallback;
		}
		return elem;
	};
	/**
	 * create element as string
	 * @param {elementCreateOptionType} [options]
	 * @returns {string}
	 */
	string = (options = {}) => {
		return this.element(options).outerHTML;
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
				curentAttrIndex = spaHelper.attributeIndex;
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
					new Ping(async () => {
						this.shadowRoot = this.attachShadow({ mode: 'open' });
						this.template = document.createElement('template');
						spaHelper.resetAttrIndex();
						spaHelper.currentDocumentScope = this.shadowRoot;
						for (const prop in defaultProps) {
							this.reactiveProps[prop.toString()] = new Let('');
						}
						let connectedCallbackOptions = {};
						({ htmlTemplate, connectedCallback = () => {} } = lifecycle(
							(connectedCallbackOptions = {
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
									return {
										get value() {
											return this_.getAttribute(propName.toString()) ?? '';
										},
										set value(newValue) {
											this.reactiveProps[propName].value = newValue;
											this_.setAttribute(propName.toString(), newValue);
										},
									};
								},
								thisElement: this,
							})
						));
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
						if (thisCustomTag.elementCCB) {
							const dcb = thisCustomTag.elementCCB(
								// @ts-ignore
								connectedCallbackOptions
							);
							if (dcb) {
								thisCustomTag.elementDCB = dcb;
							}
							// @ts-ignore
							thisCustomTag.elementCCB = null;
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
						spaHelper.attributeIndex = this.curentAttrIndex;
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
						new Ping(async () => {
							spaHelper.currentDocumentScope = this.shadowRoot;
							if (propName in this.reactiveProps) {
								this.reactiveProps[propName].value = newValue;
								attributeChangedCallback({ propName, oldValue, newValue });
							}
							spaHelper.currentDocumentScope = this.curentScope;
						});
					}
				}
				async disconnectedCallback() {
					if (disconnectedCallback) {
						new Ping(async () => {
							spaHelper.currentDocumentScope = this.shadowRoot;
							for (const prop in this.reactiveProps) {
								this.reactiveProps[prop].removeAll$();
								delete this.reactiveProps[prop];
							}
							disconnectedCallback();
							if (thisCustomTag.elementDCB) {
								thisCustomTag.elementDCB();
								// @ts-ignore
								thisCustomTag.elementDCB = null;
							}
							spaHelper.currentDocumentScope = this.curentScope;
						});
					}
				}
				adoptedCallback() {
					if (adoptedCallback) {
						new Ping(async () => {
							spaHelper.currentDocumentScope = this.shadowRoot;
							adoptedCallback();
							spaHelper.currentDocumentScope = this.curentScope;
						});
					}
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
	 * @param {string} tagName
	 * @param {{
	 * [attrNameNPropName:string]:string
	 * }} [attributeNProperty]
	 */
	constructor(tagName, attributeNProperty = {}) {
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

export class If extends Derived {
	/**
	 * Description
	 * @param {()=>Promise<string>} asyncCallback
	 */
	constructor(asyncCallback) {
		super(asyncCallback);
		this.attr = `${this.attr}="innerHTML"`;
	}
}

export class newIf {
	/**
	 * @private
	 */
	static ifElementWrapper = new CustomTag({
		tagName: 'if',
		defaultProps: { if: '' },
		lifecycle: ({ shadowRoot }) => {
			return {
				htmlTemplate: '',
				connectedCallback: () => {
					return {
						attributeChangedCallback: ({ propName, newValue }) => {
							if (propName === 'if') {
								shadowRoot.innerHTML = newValue;
							}
						},
					};
				},
			};
		},
	});
	/**
	 * @param {Derived<String>} derivedString
	 * - returns: htmlString for ShadowRoot innerHTML
	 * @return {HTMLElement}
	 */
	static element = (derivedString) => {
		const elem = newIf.ifElementWrapper.element({
			attributes: {
				/**
				 * create new Derived instance just incase
				 * if the Derived<string> are not scoped to current ShadowRoot;
				 */
				[new Derived(async () => {
					const str = derivedString.value.replace(new RegExp('"', 'g'), "'") ?? '';
					return str;
				}).attr]: 'if',
			},
		});
		return elem;
	};
	/**
	 * @param {Derived<String>} derivedString
	 * - returns: htmlString for ShadowRoot innerHTML
	 * @return {string}
	 */
	static string = (derivedString) => {
		return newIf.element(derivedString).outerHTML;
	};
}

/**
 * @typedef {Let<{[key:string]:Let<string>}>} ListType
 * - value: Let with input of
 * > -  HTMLElement attributeName;
 * > -  HTMLElement propertyName;
 * @typedef {ListType[]} ListArrayType
 */
export class LetList extends Let {
	/**
	 *
	 * @param {ListArrayType} list
	 */
	constructor(list) {
		super(list);
	}
	/**
	 * @param {number} indexA
	 * @param {number} indexB
	 */
	swap = (indexA, indexB) => {
		[this.value[indexA], this.value[indexB]] = [this.value[indexB], this.value[indexA]];
		const children = Array.from(this.documentScope.children);
		const nodeA = children[indexA];
		const nodeB = children[indexB];
		if (nodeA && nodeB) {
			this.documentScope.insertBefore(nodeA, nodeB);
			this.documentScope.insertBefore(nodeB, nodeA.nextSibling || null);
		}
		this.call$();
	};
	/**
	 * @param {ListType} newItem
	 */
	add(newItem) {
		this.value.push(newItem);
		this.call$();
	}
	/**
	 * @private
	 * @param {number} indexToRemove
	 */
	deleteIndex = (indexToRemove) => {
		this.documentScope.children[indexToRemove].remove();
	};
	/**
	 * @param {number} indexToRemove
	 */
	deleteByIndex(indexToRemove) {
		this.value = this.value.filter((_, i) => i !== indexToRemove);
		this.deleteIndex(indexToRemove);
	}
	/**
	 * @param {string} keyName
	 * @param {string} value
	 */
	deleteByKey(keyName, value) {
		this.value = this.value.filter((item, indexToRemove) => {
			if (item[keyName] === value) {
				this.deleteIndex(indexToRemove);
				return false;
			}
			return true;
		});
	}
	/**
	 * @param {number} indexToModify
	 * @param {ListType} newItem
	 */
	modifyByIndex(indexToModify, newItem) {
		this.value = this.value.map((item, i) =>
			i === indexToModify ? { ...item, ...newItem } : item
		);
	}
	/**
	 * @param {string} keyName
	 * @param {string} value
	 * @param {ListType} newItem
	 */
	modifyByKey(keyName, value, newItem) {
		this.value = this.value.map((item) =>
			item[keyName] === value ? { ...item, ...newItem } : item
		);
	}
}

/**
 * - handling looped tag;
 */
export class For {
	attr = spaHelper.attributeIndexGenerator();
	/**
	 * @private
	 * @type {import('@html_first/simple_signal').documentScope}
	 */
	documentScope;
	/**
	 * use this instance.attr to mark element,
	 * it will generate looped children;
	 * @param {HTMLElement} childElement
	 * @param {LetList} data
	 */
	constructor(childElement, data) {
		this.childElement = childElement;
		this.documentScope = spaHelper.currentDocumentScope;
		new $_(async (first) => {
			const data_ = data.value;
			if (first) {
				return;
			}
			this.fineGrainedRender(data_);
		});
	}
	/**
	 * @private
	 */
	childElement;
	/**
	 * @private
	 * @param {HTMLElement|Element|ShadowRoot} targetElement
	 * @param {number} n
	 */
	static trimChildNode = (targetElement, n) => {
		const children = targetElement.children;
		const excess = children.length - n;
		if (excess > 0) {
			for (let i = children.length - 1; i >= n; i--) {
				targetElement.removeChild(children[i]);
			}
		}
	};
	/**
	 * @private
	 * @param {ListArrayType} data
	 */
	fineGrainedRender = (data) => {
		const targetElement = this.documentScope.querySelector(`[${this.attr}]`);
		if (!targetElement) {
			return;
		}
		const childElement = this.childElement;
		const dataLength = data.length;
		For.trimChildNode(targetElement, dataLength);
		const children = targetElement.childNodes;
		for (let i = children.length; i < data.length; i++) {
			const data__ = data[i].value;
			const childElement__ = childElement.cloneNode();
			if (!(childElement__ instanceof HTMLElement)) {
				continue;
			}
			for (const attributeName__ in data__) {
				childElement__.setAttribute(data__[attributeName__].attr, attributeName__);
				try {
					if (!(attributeName__ in childElement__)) {
						throw '';
					}
					childElement__[attributeName__] = data__[attributeName__].value;
					continue;
				} catch (error) {
					if (attributeName__ == '') {
						console.warn({
							childElement: childElement__,
							attributeName: attributeName__,
							message: "doesn't have target",
						});
						continue;
					}
					childElement__.setAttribute(attributeName__, data__[attributeName__].value);
				}
			}
			targetElement.appendChild(childElement__);
		}
	};
}

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
			app.innerHTML = rootTag.string();
			if (useSPARouter) {
				new QueryRouter();
			}
		});
	}
}
