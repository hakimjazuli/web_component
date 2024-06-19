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
 * @callback replace_type
 * @param {{
 * id:string,
 * element:HTMLElement
 * }} options
 * @returns {void}
 */
/**
 * @typedef {{
 * shadow_root:ShadowRoot,
 * element:HTMLElement,
 * replace:replace_type,
 * }} callback_on_options
 */
/**
 * Description
 * @param {[HTMLElement,string,listener:()=>((Promise<void>)|void)][]} functions
 * @returns {()=>void}
 */
export const make_unsubs = (functions) => {
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
 * @template P
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
	 * props?:P,
	 * on_mount?:(options:callback_on_options)=>(()=>void),
	 * effect?:(options:callback_on_options & {
	 * prop_name:Extract<keyof NonNullable<P>, string>,old_value:any,new_value:any
	 * })=>void
	 * }} options
	 */
	constructor({ tag, html, props = undefined, on_mount = undefined, effect = undefined }) {
		this.tag = `h-${tag}`;
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
					if (props) {
						for (const prop in props) {
							this.attributeChangedCallback(prop, '', props[prop]);
						}
					}
				}
				connectedCallback() {
					if (this.shadowRoot && on_mount) {
						this.on_un_mounted = on_mount({
							shadow_root: this.shadowRoot,
							element: this,
							replace: this.replace,
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
				 * @param {Extract<keyof NonNullable<P>, string>} prop_name
				 * @param {string} old_value
				 * @param {any} new_value
				 */
				attributeChangedCallback(prop_name, old_value, new_value) {
					if (this.shadowRoot && effect) {
						effect({
							shadow_root: this.shadowRoot,
							element: this,
							replace: this.replace,
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
	 * props?:Partial<P>,
	 * slots?:string[]
	 * }} options
	 * @returns {{
	 * element:HTMLElement,
	 * set_props:(props:Partial<P>)=>void
	 * }}
	 */
	make = ({ props, slots = [] }) => {
		const element = document.createElement(this.tag);
		element.innerHTML = slots.join('');
		for (const prop in props) {
			// @ts-ignore
			element.setAttribute(prop, props[prop]);
		}
		return {
			element,
			set_props: (props) => {
				for (const prop in props) {
					// @ts-ignore
					element.setAttribute(prop, props[prop]);
				}
			},
		};
	};
}
