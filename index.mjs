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
 * @template props_
 */
export class _WC {
	/**
	 * @private
	 * @type {props_}
	 */
	props;
	/**
	 * @public
	 * @type {string}
	 */
	tag;
	/**
	 * @typedef {{shadow_root:ShadowRoot,element:HTMLElement}} callback_on_options
	 */
	/**
	 * @public
	 * @param {{
	 * tag:string,
	 * html_template:string,
	 * props:props_,
	 * on_mount:(options:callback_on_options)=>(()=>void),
	 * effect:(options:callback_on_options & {
	 * prop_name:string,old_value:any,new_value:any
	 * })=>void
	 * }} options
	 */
	constructor({ tag, html_template, props, on_mount, effect }) {
		this.tag = `h-${tag}`;
		this.props = props;
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
				constructor() {
					super();
					this.element = this;
					this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					template.innerHTML = html_template;
					if (this.shadowRoot) {
						this.shadowRoot.appendChild(template.content.cloneNode(true));
					}
					for (const prop in props) {
						this.attributeChangedCallback(prop, '', props[prop]);
					}
				}
				connectedCallback() {
					if (this.shadowRoot) {
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
					if (this.shadowRoot) {
						this.on_un_mounted();
					}
				}
				/**
				 * @param {string} prop_name
				 * @param {string} old_value
				 * @param {any} new_value
				 */
				attributeChangedCallback(prop_name, old_value, new_value) {
					if (this.shadowRoot) {
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
	// /**
	//  * @param {props_} props
	//  * @param {string[]} slots
	//  * @returns {string}
	//  */
	// make = (props, slots = []) => {
	// 	let props__ = [];
	// 	for (const prop in props) {
	// 		props;
	// 	}
	// 	return `
	//     <${this.tag} >
	//     ${slots.map((slot) => {
	// 		return slot;
	// 	})}
	//     </${this.tag}>
	//     `;
	// };
}
