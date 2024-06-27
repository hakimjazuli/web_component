// @ts-check

/**
 * @param {{element:HTMLElement,type:string,listener:()=>((Promise<void>)|void)}[]} functions
 * @returns {()=>void} unsubscribes callback
 */
export const makeListeners = (functions) => {
	let unsubs_ = [];
	for (let i = 0; i < functions.length; i++) {
		const { element, type, listener } = functions[i];
		element.addEventListener(type, listener);
		unsubs_.push(() => element.removeEventListener(type, listener));
	}
	return () => {
		for (let i = 0; i < unsubs_.length; i++) {
			unsubs_[i]();
		}
	};
};

let subscriber = null;

/**
 * @param {()=>Promise<void>} async_fn
 * @returns {Promise<void>}
 */
export const makeEffect = async (async_fn) => {
	subscriber = async_fn;
	await async_fn();
	subscriber = null;
};
/**
 * @typedef {(options:{
 * slotName:string,
 * element:HTMLElement
 * }[])=>void} replace_type
 */
/**
 * @typedef get_set_prop_type
 * @property {()=>string} get
 * @property {(newValue:string)=>void} set
 */

/**
 * @typedef {()=>void} disconnectedCallback
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
	 * @typedef {{
	 * shadowRoot:ShadowRoot,
	 * element:HTMLElement,
	 * propElements:(propName:Extract<keyof NonNullable<PROP>, string>)=>{element:NodeListOf<HTMLElement|Element>|undefined,value:string}[],
	 * }} callback_on_options
	 */
	/**
	 * @typedef {callback_on_options & {
	 * changed:{propName:Extract<keyof NonNullable<PROP>, string>,oldValue:string,newValue:string}
	 * }} attributeChangedCallback_options
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
	 * connectedCallback?:(options:callback_on_options)=>(disconnectedCallback),
	 * attributeChangedCallback?:(options:attributeChangedCallback_options)=>void,
	 * tagPrefix?:string,
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
	}) {
		this.tag = `${tagPrefix}-${tagName}`
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-+/g, '-');
		if (slotNames) {
			this.slots = slotNames;
		}
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
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
				connectedCallback() {
					if (this.shadowRoot && connectedCallback) {
						this.onUnMounted = connectedCallback(this.callback_on_options);
					}
				}
				/**
				 * @private
				 * @type {()=>void}
				 */
				onUnMounted;
				disconnectedCallback() {
					if (this.shadowRoot && connectedCallback) {
						this.onUnMounted();
					}
				}
				/**
				 * @param {Extract<keyof NonNullable<PROP>, string>} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					/**
					 * @type {attributeChangedCallback_options}
					 */
					const obj = {};
					for (const key in this.callback_on_options) {
						obj[key] = this.callback_on_options[key];
					}
					obj.changed = {
						propName,
						oldValue,
						newValue,
					};
					if (this.shadowRoot && attributeChangedCallback) {
						attributeChangedCallback(obj);
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
	 * @param {{
	 * props?:Partial<PROP>,
	 * slots?:Record<Extract<keyof NonNullable<SLOTS>, string>, HTMLElement>
	 * }} [options]
	 * @returns {{
	 * element:HTMLElement,
	 * prop:Record<Extract<keyof NonNullable<PROP>, string>, get_set_prop_type>,
	 * }}
	 */
	makeElement = ({ props = undefined, slots = undefined } = undefined) => {
		const element = document.createElement(this.tag);
		/**
		 * @type {Record<Extract<keyof NonNullable<PROP>, string>, get_set_prop_type>}
		 */
		// @ts-ignore
		const props_ = {};
		if (props) {
			for (const prop in props) {
				const subscription = [];
				element.setAttribute(prop, props[prop] ?? '');
				/**
				 * @type {get_set_prop_type}
				 */
				props_[prop] = {
					get: () => {
						if (subscriber) {
							subscription.push(subscriber);
						}
						return element.getAttribute(prop) ?? '';
					},
					set: async (newValue) => {
						element.setAttribute(prop, newValue);
						Promise.all(
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
					},
				};
			}
		}
		if (slots) {
			for (const slot in this.slots) {
				const slot_element = slots[slot];
				slot_element.setAttribute('slot', slot);
				element.appendChild(slot_element);
			}
		}
		return {
			element,
			prop: props_,
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
