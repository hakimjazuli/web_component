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

/**
 * @typedef {(options:{
 * slotName:string,
 * element:HTMLElement
 * }[])=>void} replace_type
 */
/**
 * @typedef {{
 * shadowRoot:ShadowRoot,
 * element:HTMLElement
 * }} callback_on_options
 */

/**
 * @typedef {()=>void} disconnectedCallback
 */

/**
 * @template {Object.<string, string>} PROP
 * @template {Object.<string, ''>}SLOTS
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
	 * @public
	 * @param {{
	 * tagName:string,
	 * htmlTemplate:(options:{slotTag:(slotName:Extract<keyof NonNullable<SLOTS>, string>)=>string})=>string,
	 * slotNames?:SLOTS,
	 * propsDefault?:PROP,
	 * connectedCallback?:(options:callback_on_options)=>(disconnectedCallback),
	 * attributeChangedCallback?:(options:callback_on_options & {
	 * propName:Extract<keyof NonNullable<PROP>, string>,oldValue:string,newValue:string
	 * })=>void,
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
		tagPrefix = 'h',
	}) {
		this.tag = `${tagPrefix}-${tagName}`;
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
						slotTag: (slot) => {
							return `<slot name="${slot}"></slot>`;
						},
					});
					if (this.shadowRoot) {
						this.shadowRoot.appendChild(template.content.cloneNode(true));
					}
					if (propsDefault) {
						for (const prop in propsDefault) {
							this.attributeChangedCallback(prop, '', propsDefault[prop]);
						}
					}
				}
				connectedCallback() {
					if (this.shadowRoot && connectedCallback) {
						this.onUnMounted = connectedCallback({
							shadowRoot: this.shadowRoot,
							element: this,
						});
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
					if (this.shadowRoot && attributeChangedCallback) {
						attributeChangedCallback({
							shadowRoot: this.shadowRoot,
							element: this,
							propName,
							oldValue,
							newValue,
						});
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
	 * setProp:(propName:Extract<keyof NonNullable<PROP>, string>, newValue:string)=>Promise<void>,
	 * getProp:(propName:Extract<keyof NonNullable<PROP>, string>, registerListener?:()=>Promise<void>)=>string,
	 * }}
	 */
	makeElement = ({ props = undefined, slots = undefined } = undefined) => {
		const element = document.createElement(this.tag);
		if (props) {
			for (const prop in props) {
				element.setAttribute(prop, props[prop] ?? '');
			}
		}
		if (slots) {
			for (const slot in this.slots) {
				const slot_element = slots[slot];
				slot_element.setAttribute('slot', slot);
				element.appendChild(slot_element);
			}
		}
		/**
		 * @type {Object.<string, (()=>Promise<void>)[]>}
		 */
		const listeners = {};
		return {
			element,
			setProp: async (propName, newValue) => {
				element.setAttribute(propName, newValue);
				if (!listeners[propName]) {
					return;
				}
				Promise.all(listeners[propName].map((listener) => listener()));
			},
			getProp: (propName, registerListener = undefined) => {
				if (registerListener) {
					if (!listeners[propName]) {
						listeners[propName] = [];
					}
					if (
						!listeners[propName].some(
							(existingListener) => existingListener === registerListener
						)
					) {
						listeners[propName].push(registerListener);
					}
				}
				return element.getAttribute(propName) ?? '';
			},
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
 * setProp:(propName:'data', newValue:string)=>Promise<void>,
 * getProp:(propName:'data', registerListener?:()=>Promise<void>)=>string,
 * }}
 */
export const ForTag = ({ tagName, data, loopedElement }) => {
	const loopedElement_ = loopedElement.cloneNode(true);
	return new CustomTag({
		tagName,
		propsDefault: {
			data: JSON.stringify(data),
		},
		htmlTemplate: (s) => {
			return /* HTML */ ``;
		},
		attributeChangedCallback: (e) => {
			try {
				switch (e.propName) {
					case 'data':
						/**
						 * @type {Object.<string,string>[]}
						 */
						const elementsProps = JSON.parse(e.newValue);
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
		tagPrefix: 'f',
	}).makeElement({});
};
/**
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 * example
 */
new CustomTag({
	tagName: 'test',
	propsDefault: {
		aka: '',
	},
	slotNames: {
		a: '',
		v: '',
	},
	htmlTemplate: (s) => {
		return /* HTML */ `
			<div></div>
			${s.slotTag('v')}
		`;
	},
}).makeElement({
	props: {
		aka: '',
	},
});
