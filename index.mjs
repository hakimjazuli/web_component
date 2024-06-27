// @ts-check

import { _QueueFIFO, _QueueObjectFIFO } from '@html_first/simple_queue';

let subscriber = null;
const queue_handler = new _QueueFIFO();

/**
 * @typedef {{
 * type:string,
 * listener:()=>void,
 * element:HTMLElement,
 * }} listeners_input_type
 */
export class Listeners {
	/**
	 * @param {listeners_input_type[]} [listeners]
	 */
	constructor(listeners = []) {
		this.unsubscribersList = [];
		for (let i = 0; i < listeners.length; i++) {
			const { type, element, listener } = listeners[i];
			element.addEventListener(type, listener);
			this.unsubscribersList.push(() => {
				element.removeEventListener(type, listener);
			});
		}
	}
	unsubs = () => {
		this.unsubscribersList.forEach((unsub) => {
			unsub();
		});
	};
	/**
	 * @param {()=>void} unsubscriber
	 */
	addUnsubscriber = (unsubscriber) => {
		this.unsubscribersList.push(unsubscriber);
	};
	/**
	 * @type {(()=>void)[]}
	 */
	unsubscribersList;
}

/**
 * @typedef {(options:{
 * slotName:string,
 * element:HTMLElement
 * }[])=>void} replace_type
 */
/**
 * @typedef {Object} get_set_prop_type
 * @property {()=>any} value Getter function for getting the property value.
 * @property {(newValue:any)=>void} value Setter function for setting the property value.
 */

/**
 * @template {Object.<string, string>} PROP
 * @template {Object.<string, ''>} SLOTS
 */
export class CustomTag {
	/**
	 * @private
	 * @type {string}
	 */
	tag;
	/**
	 * @private
	 * @type {SLOTS}
	 */
	slots;
	/**
	 * @private
	 * @type {false|number}
	 */
	debounce = false;
	/**
	 * @typedef {{
	 * shadowRoot:ShadowRoot,
	 * element:HTMLElement,
	 * propElements:(propName:Extract<keyof NonNullable<PROP>, string>)=>{element:HTMLElement,attributeValue:string}[],
	 * makeListeners: (listener:listeners_input_type[])=>Listeners;
	 * }} callback_on_options
	 */
	/**
	 * @typedef {callback_on_options & {
	 * changed:{propName:Extract<keyof NonNullable<PROP>, string>,oldValue:string,newValue:string}
	 * }} attributeChangedCallback_options
	 */
	/**
	 * @typedef {callback_on_options &  {
	 * effect:(async_fn:()=>Promise<void>)=>void
	 * }} connectedCallback_options
	 */
	/**
	 * @public
	 * @param {{
	 * tagName:string,
	 * htmlTemplate:(
	 * 	options:({
	 * 		propAttribute:(propName:Extract<keyof NonNullable<PROP>, string>,attrValue?:string)=>string,
	 * 		slotTag:(slotName:Extract<keyof NonNullable<SLOTS>, string>)=>string
	 * 	})
	 * )=>string,
	 * slotNames?:SLOTS,
	 * propsDefault?:PROP,
	 * connectedCallback?:(options:connectedCallback_options)=>void,
	 * attributeChangedCallback?:(options:attributeChangedCallback_options)=>void,
	 * tagPrefix?:string,
	 * debounce?:false|number,
	 * }} options
	 */
	constructor({
		tagName,
		htmlTemplate,
		slotNames = undefined,
		propsDefault = undefined,
		connectedCallback = undefined,
		attributeChangedCallback = undefined,
		tagPrefix = 'hwc',
		debounce = false,
	}) {
		this.propsDefault = propsDefault;
		this.tag = `${tagPrefix}-${tagName}`
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-+/g, '-');
		if (slotNames) {
			this.slots = slotNames;
		}
		this.debounce = debounce;
		const this_ = this;
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
				/**
				 * @type {null|Listeners}
				 */
				listener = null;
				constructor() {
					super();
					this.element = this;
					this.attachShadow({
						mode: 'open',
					});
					const template = document.createElement('template');
					template.innerHTML = htmlTemplate({
						propAttribute: (propName, attrValue = '') => {
							return `prop-${propName}="${attrValue}"`;
						},
						slotTag: (slotName) => {
							return `<slot name="${slotName}"></slot>`;
						},
					});
					if (this.shadowRoot) {
						this.shadowRoot.appendChild(template.content.cloneNode(true));
						this.callback_on_options = {
							shadowRoot: this.shadowRoot,
							element: this,
							propElements: (propName) => {
								let elements;
								if (this.shadowRoot) {
									elements = this.shadowRoot.querySelectorAll(
										`[prop-${propName}]`
									);
								}
								let elem = [];
								if (elements) {
									elements.forEach((element) => {
										elem.push({
											element,
											value: element.getAttribute(`prop-${propName}`) ?? '',
										});
									});
								}
								return elem;
							},
							makeListeners: (listener) => {
								if (this.listener === null) {
									this.listener = new Listeners(listener);
								}
								return this.listener;
							},
						};
					}
					if (propsDefault) {
						for (const prop in propsDefault) {
							this.attributeChangedCallback(prop, '', propsDefault[prop]);
						}
					}
				}
				/**
				 * @type {callback_on_options}
				 */
				callback_on_options;
				// connectedCallback_returns = {};
				connectedCallback() {
					/**
					 * @type {connectedCallback_options}
					 */
					const obj = {};
					for (const key in this.callback_on_options) {
						obj[key] = this.callback_on_options[key];
					}
					obj.effect = async (async_fn) => {
						subscriber = async_fn;
						await async_fn();
						subscriber = null;
					};
					this_.assignPropController(this.element, propsDefault);
					if (this.shadowRoot && connectedCallback) {
						connectedCallback(obj);
					}
				}
				disconnectedCallback() {
					if (this.shadowRoot && this.listener?.unsubscribersList.length) {
						this.listener.unsubs();
					}
				}
				/**
				 * @private
				 * @type {attributeChangedCallback_options|null}
				 */
				attributeChangedCallback_obj = null;
				/**
				 * @param {Extract<keyof NonNullable<PROP>, string>} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					if (this.attributeChangedCallback_obj === null) {
						// @ts-ignore
						this.attributeChangedCallback_obj = {};
						for (const key in this.callback_on_options) {
							// @ts-ignore
							this.attributeChangedCallback_obj[key] = this.callback_on_options[key];
						}
					}
					if (this.attributeChangedCallback_obj != null) {
						this.attributeChangedCallback_obj.changed = {
							propName,
							oldValue,
							newValue,
						};
					}
					if (
						this.shadowRoot &&
						attributeChangedCallback &&
						this.attributeChangedCallback_obj
					) {
						attributeChangedCallback(this.attributeChangedCallback_obj);
					}
				}
				static get observedAttributes() {
					const props__ = [];
					for (const prop in propsDefault) {
						props__.push(prop);
					}
					return props__;
				}
			}
		);
	}
	/**
	 * @private
	 * @param {HTMLElement} element
	 * @param {Partial<PROP>|undefined} props
	 * @returns {void}
	 */
	assignPropController = (element, props = undefined) => {
		const this_ = this;
		/**
		 * @type {Record<Extract<keyof NonNullable<PROP>, string>, get_set_prop_type>}
		 */
		const props_ = this.propsController;
		if (!props) {
			return;
		}
		for (const prop in props) {
			const subscription = [];
			element.setAttribute(prop, props[prop] ?? '');
			/**
			 * @type {get_set_prop_type}
			 */
			props_[prop] = {
				get value() {
					if (
						subscriber &&
						!subscription.some((fn) => fn.toString() === subscriber.toString())
					) {
						subscription.push(subscriber);
					}
					return JSON.parse(element.getAttribute(prop) ?? '');
				},
				set value(newValue) {
					element.setAttribute(prop, JSON.stringify(newValue));
					queue_handler.assign(
						new _QueueObjectFIFO(async () => {
							await Promise.all(
								subscription.map(async (callback) => {
									try {
										return await callback();
									} catch (error) {
										console.error('Error in callback:', error);
										throw error;
									}
								})
							).catch((error) => {
								console.error('Promise.all failed:', error);
							});
						}, this_.debounce)
					);
				},
			};
		}
		this.propsController = props_;
	};
	/**
	 * @private
	 * @type {Record<Extract<keyof NonNullable<PROP>, string>, get_set_prop_type>}
	 */
	// @ts-ignore
	propsController = {};
	/**
	 * @param {{
	 * props?:Partial<PROP>,
	 * slots?:Record<Extract<keyof NonNullable<SLOTS>, string>, HTMLElement>
	 * }} [options]
	 * @returns {{
	 * element:HTMLElement,
	 * prop:Record<Extract<keyof NonNullable<PROP>, string>, get_set_prop_type>,
	 * }}
	 */
	makeElement = ({ props = undefined, slots = undefined } = {}) => {
		const element = document.createElement(this.tag);
		this.assignPropController(element, props);
		if (slots) {
			for (const slot in this.slots) {
				const slot_element = slots[slot];
				slot_element.setAttribute('slot', slot);
				element.appendChild(slot_element);
			}
		}
		return {
			element,
			prop: this.propsController,
		};
	};
}
/**
 * @param {{
 * tagName:string,
 * data:Object.<string,string>[],
 * loopedElement:HTMLElement
 * }} options
 * @returns {{
 * element:HTMLElement,
 * prop:Record<'data', get_set_prop_type>,
 * }}
 */
export const ForElement = ({ tagName, data, loopedElement }) => {
	const loopedElement_ = loopedElement.cloneNode(true);
	return new CustomTag({
		tagPrefix: 'for',
		tagName,
		propsDefault: {
			data: JSON.stringify(data),
		},
		htmlTemplate: (s) => {
			return /* HTML */ ``;
		},
		attributeChangedCallback: (e) => {
			try {
				switch (e.changed.propName) {
					case 'data':
						/**
						 * @type {Object.<string,string>[]}
						 */
						const elementsProps = JSON.parse(e.changed.newValue);
						e.shadowRoot.innerHTML = '';
						if (!(loopedElement_ instanceof HTMLElement)) {
							return;
						}
						for (let i = 0; i < elementsProps.length; i++) {
							const elementProp = elementsProps[i];
							for (const key in elementProp) {
								loopedElement_.setAttribute(key, elementProp[key]);
							}
							e.shadowRoot.appendChild(loopedElement_);
						}
						break;
				}
			} catch (error) {
				console.error(error);
			}
		},
	}).makeElement({});
};
/**
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 * MUTAIONSSSSSSSSSSSSSSS;
 */
/**
 * @param {string} json_input
 * @returns {string}
 */
const mutation_check = (json_input) => '';
