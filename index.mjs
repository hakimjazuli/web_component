// @ts-check

import { _QueueFIFO, _QueueObjectFIFO } from '@html_first/simple_queue';

let subscriber = null;
const queue_handler = new _QueueFIFO();
/**
 * @param {any} value
 * @returns {string}
 */
const valid_attribute_value = (value) => {
	if (typeof value == 'string') {
		return value;
	}
	return JSON.stringify(value).replace(/^"(.*)"$/, '$1');
};
/**
 * @typedef {{
 * type:string,
 * listener:()=>void,
 * element:HTMLElement,
 * }} listeners_input_type
 */
class Listeners {
	/**
	 * @param {listeners_input_type[]} [listeners]
	 */
	constructor(listeners = []) {
		this.unsubscribersList = [];
		for (let i = 0; i < listeners.length; i++) {
			const { type, element, listener } = listeners[i];
			element.addEventListener(type, listener);
			this.addUnsubscribers(() => {
				element.removeEventListener(type, listener);
			});
		}
	}
	/**
	 * @private
	 */
	unsubs = () => {
		this.unsubscribersList.forEach((unsub) => {
			unsub();
		});
	};
	/**
	 * @param {(()=>void)[]} unsubscribers
	 */
	addUnsubscribers = (...unsubscribers) => {
		this.unsubscribersList.push(...unsubscribers);
	};
	/**
	 * @private
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
 * @template {Object.<string, any>} PROP
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
	 * @typedef {{
	 * shadowRoot:ShadowRoot,
	 * element:HTMLElement,
	 * reflectToDOM:(propName:Extract<keyof NonNullable<PROP>, string>, value:any)=>void,
	 * }} callback_on_options
	 */
	/**
	 * @typedef {callback_on_options & {
	 * changed:{propName:Extract<keyof NonNullable<PROP>, string>,oldValue:string,newValue:string}
	 * }} attributeChangedCallback_options
	 */
	/**
	 * @typedef {callback_on_options &  {
	 * effect:(async_fn:()=>Promise<void>)=>void,
	 * listeners: (listener:listeners_input_type[])=>Listeners,
	 * }} connectedCallback_options
	 */
	/**
	 * @public
	 * @param {{
	 * tagName:string,
	 * htmlTemplate:(
	 * 	options:({
	 * 		propAttributes:(propName:Extract<keyof NonNullable<PROP>, string>,attrValues:string[])=>string,
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
	constructor(options) {
		const {
			tagName,
			htmlTemplate,
			slotNames = undefined,
			propsDefault = undefined,
			connectedCallback = undefined,
			attributeChangedCallback = undefined,
			tagPrefix = 'hwc',
			debounce = false,
		} = options;
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
						propAttributes: (propName, attrValues = []) => {
							return `prop-${propName}="${attrValues.join(';')}"`;
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
							reflectToDOM: (propName, value) => {
								let elements_;
								if (this.shadowRoot) {
									elements_ = this.shadowRoot.querySelectorAll(
										`[prop-${propName}]`
									);
								}
								if (!elements_) {
									return;
								}
								elements_.forEach((element) => {
									const targets_ = element.getAttribute(`prop-${propName}`) ?? '';
									const targets = targets_.split(';');
									for (let o = 0; o < targets.length; o++) {
										const target = targets[o];
										try {
											if (!(target in element)) {
												throw '';
											}
											element[target] = value;
										} catch (error) {
											element.setAttribute(target, value);
										}
									}
								});
							},
						};
					}
					if (propsDefault) {
						for (const prop in propsDefault) {
							this.attributeChangedCallback(
								prop,
								'',
								valid_attribute_value(propsDefault[prop])
							);
						}
					}
				}
				/**
				 * @type {callback_on_options}
				 */
				callback_on_options;
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
					obj.listeners = (listener) => {
						if (this.listener === null) {
							this.listener = new Listeners(listener);
						}
						return this.listener;
					};
					this_.assignPropController(this.element, propsDefault);
					if (this.shadowRoot && connectedCallback) {
						connectedCallback(obj);
					}
				}
				disconnectedCallback() {
					// @ts-ignore
					if (this.shadowRoot && this.listener?.unsubscribersList.length) {
						// @ts-ignore
						this.listener.unsubs();
					}
				}
				/**
				 * @type {attributeChangedCallback_options}
				 */
				attributeChangedCallback_option;
				/**
				 * @param {Extract<keyof NonNullable<PROP>, string>} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					// @ts-ignore
					this.attributeChangedCallback_option = {};
					Object.assign(this.attributeChangedCallback_option, this.callback_on_options, {
						changed: {
							propName,
							oldValue,
							newValue,
						},
					});
					if (
						this.shadowRoot &&
						attributeChangedCallback &&
						this.attributeChangedCallback_option
					) {
						attributeChangedCallback(this.attributeChangedCallback_option);
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
					element.setAttribute(prop, valid_attribute_value(newValue));
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
						}, false)
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
 * initialData:Object.<string,string>[],
 * loopedTag:CustomTag,
 * suspense: string,
 * }} options
 * @returns {{
 * element:HTMLElement,
 * prop:Record<'data', get_set_prop_type>,
 * }}
 */
export const ForElement = (options) => {
	const { tagName, initialData, loopedTag, suspense } = options;
	return new CustomTag({
		tagPrefix: 'for',
		tagName,
		propsDefault: {
			data: JSON.stringify(initialData),
			ready: 'false',
		},
		htmlTemplate: (s) => {
			return /* HTML */ ``;
		},
		attributeChangedCallback: (e) => {
			try {
				switch (e.changed.propName) {
					case 'ready':
						if (e.changed.newValue == 'false') {
							e.shadowRoot.innerHTML = suspense;
						}
						break;
					case 'data':
						/**
						 * @type {Object.<string,string>[]}
						 */
						const elementsProps = JSON.parse(e.changed.newValue);
						if (!elementsProps.length) {
							e.element.setAttribute('ready', 'false');
						} else {
							if (e.element.getAttribute('ready') !== 'true') {
								e.element.setAttribute('ready', 'true');
							}
						}
						let i = 0;
						e.shadowRoot.childNodes.forEach((element) => {
							const elementProp = elementsProps[i];
							if (!elementProp) {
								element.remove();
							} else if (element instanceof HTMLElement) {
								for (const key in elementProp) {
									if (element.getAttribute(key) !== elementProp[key]) {
										element.setAttribute(key, elementProp[key]);
									}
								}
							}
							i++;
						});
						if (i < elementsProps.length - 1) {
							for (i; i < elementsProps.length; i++) {
								e.shadowRoot.appendChild(
									loopedTag.makeElement({ props: elementsProps[i] }).element
								);
							}
						}
						break;
				}
			} catch (error) {
				console.error(error);
			}
		},
	}).makeElement({});
};
