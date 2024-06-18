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
 * Description
 * @param {[HTMLElement,string,listener:()=>((Promise<void>)|void)][]} functions
 * @returns {()=>void}
 */
const make_unsubs = (functions) => {
	let unsubs_ = [];
	for (let i = 0; i < functions.length; i++) {
		const [element, type, listener] = functions[i];
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
 * @typedef {{shadow_root:ShadowRoot,element:HTMLElement}} callback_on_options
 */

/**
 * @template props_
 */
export class _WC {
	/**
	 * @public
	 * @type {string}
	 */
	tag;
	/**
	 * @public
	 * @param {{
	 * tag:string,
	 * html:string,
	 * props?:props_,
	 * on_mount?:(options:callback_on_options)=>(()=>void),
	 * effect?:(options:callback_on_options & {
	 * prop_name:string,old_value:any,new_value:any
	 * })=>void
	 * }} options
	 */
	constructor({ tag, html, props = undefined, on_mount = undefined, effect = undefined }) {
		this.tag = `h-${tag}`;
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
				constructor() {
					super();
					this.element = this;
					this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					template.innerHTML = html;
					if (this.shadowRoot) {
						this.shadowRoot.appendChild(template.content.cloneNode(true));
					}
					for (const prop in props) {
						this.attributeChangedCallback(prop, '', props[prop]);
					}
				}
				connectedCallback() {
					if (this.shadowRoot && on_mount) {
						this.on_un_mounted = on_mount({
							shadow_root: this.shadowRoot,
							element: this,
						});
					}
				}
				/**
				 * @private
				 * @type {()=>void}
				 */
				on_un_mounted;
				disconnectedCallback() {
					if (this.shadowRoot && on_mount) {
						this.on_un_mounted();
					}
				}
				/**
				 * @param {string} prop_name
				 * @param {string} old_value
				 * @param {any} new_value
				 */
				attributeChangedCallback(prop_name, old_value, new_value) {
					if (this.shadowRoot && effect) {
						effect({
							shadow_root: this.shadowRoot,
							element: this,
							prop_name,
							old_value,
							new_value,
						});
					}
				}
				static get observedAttributes() {
					const props__ = [];
					for (const prop in props) {
						props__.push(prop);
					}
					return props__;
				}
			}
		);
	}
	/**
	 * @param {{
	 * props?:props_,
	 * slots?:string[]
	 * }} options
	 * @returns {string}
	 */
	make = ({ props, slots = [] }) => {
		let props__ = [];
		for (const prop in props) {
			props__.push(`${prop}="${props[prop]}"`);
		}
		return `<${this.tag} ${props__.join(' ')}>${slots.join('')}</${this.tag}>`;
	};
}
