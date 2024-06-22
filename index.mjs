// @ts-check

/**
 * @param {TemplateStringsArray} strings
 * @param {string[]} values
 * @returns {string}
 */
export const html = (strings, ...values) => {
	let result = '';
	for (let i = 0; i < strings.length; i++) {
		result += strings[i];
		if (i < values.length) {
			result += values[i];
		}
	}
	return result;
};

/**
 * @param {{element:HTMLElement,type:string,listener:()=>((Promise<void>)|void)}[]} functions
 * @returns {()=>void} unsubscribe callback
 */
export const subscribe = (functions) => {
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
 * id:string,
 * element:HTMLElement
 * })=>void} replace_type
 */
/**
 * @typedef {{
 * shadowRoot:ShadowRoot,
 * element:HTMLElement,
 * replace:replace_type,
 * }} callback_on_options
 */

/**
 * @typedef {()=>void} disconnectedCallback
 */

/**
 * @template {Object.<string, string>} P
 */
export class CustomTag {
	/**
	 * @public
	 * @param {{
	 * tag:string,
	 * html:string,
	 * defaultProps?:P,
	 * connectedCallback?:(options:callback_on_options)=>(disconnectedCallback),
	 * attributeChangedCallback?:(options:callback_on_options & {
	 * propName:Extract<keyof NonNullable<P>, string>,oldValue:string,newValue:string
	 * })=>void,
	 * tagPrefix?:string,
	 * }} options
	 */
	constructor({
		tag,
		html,
		defaultProps: defaultProps = undefined,
		connectedCallback = undefined,
		attributeChangedCallback = undefined,
		tagPrefix = 'h',
	}) {
		this.tag = `${tagPrefix}-${tag}`;
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
				/**
				 * @type {replace_type}
				 */
				replace = ({ id, element }) => {
					if (!this.shadowRoot) {
						return;
					}
					const id_ = this.shadowRoot.getElementById(id);
					if (id_) {
						id_.replaceWith(element);
					}
				};
				constructor() {
					super();
					this.element = this;
					this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					template.innerHTML = html;
					if (this.shadowRoot) {
						this.shadowRoot.appendChild(template.content.cloneNode(true));
					}
					if (defaultProps) {
						for (const prop in defaultProps) {
							this.attributeChangedCallback(prop, '', defaultProps[prop]);
						}
					}
				}
				connectedCallback() {
					if (this.shadowRoot && connectedCallback) {
						this.onUnMounted = connectedCallback({
							shadowRoot: this.shadowRoot,
							element: this,
							replace: this.replace,
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
				 * @param {Extract<keyof NonNullable<P>, string>} prop_name
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(prop_name, oldValue, newValue) {
					if (this.shadowRoot && attributeChangedCallback) {
						attributeChangedCallback({
							shadowRoot: this.shadowRoot,
							element: this,
							replace: this.replace,
							propName: prop_name,
							oldValue,
							newValue,
						});
					}
				}
				static get observedAttributes() {
					const props__ = [];
					for (const prop in defaultProps) {
						props__.push(prop);
					}
					return props__;
				}
			}
		);
	}
	/**
	 * @param {{
	 * props?:Partial<P>,
	 * slots?:string[]
	 * }} options
	 * @returns {{
	 * element:HTMLElement,
	 * setProp:(prop:Extract<keyof NonNullable<P>, string>, new_value:string)=>Promise<void>,
	 * getProp:(prop:Extract<keyof NonNullable<P>, string>,registerCallback?:()=>Promise<void>)=>string,
	 * }}
	 */
	makeElement = ({ props, slots = [] }) => {
		const element = document.createElement(this.tag);
		element.innerHTML = slots.join('');
		for (const prop in props) {
			// @ts-ignore
			element.setAttribute(prop, props[prop]);
		}
		/**
		 * @type {Object.<string, (()=>void|Promise<void>)[]>}
		 */
		const listeners = {};
		return {
			element,
			setProp: async (prop, new_value) => {
				element.setAttribute(prop, new_value);
				if (!listeners[prop]) {
					return;
				}
				Promise.all(listeners[prop].map((listener) => listener()));
			},
			getProp: (prop, registerCallback = undefined) => {
				if (registerCallback) {
					if (!listeners[prop]) {
						listeners[prop] = [];
					}
					if (
						!listeners[prop].some(
							(existingListener) => existingListener === registerCallback
						)
					) {
						listeners[prop].push(registerCallback);
					}
				}
				return element.getAttribute(prop) ?? '';
			},
		};
	};
}
