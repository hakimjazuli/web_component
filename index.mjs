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
	 * @public
	 * @type {props_}
	 */
	props;
	/**
	 * @public
	 * @type {string}
	 */
	tag;
	/**
	 * @public
	 * @param {string} tag
	 * @param {string} html_template
	 * @param {props_} props
	 * @param {(element:ShadowRoot)=>(()=>void)} connected_callback
	 * @param {(element:ShadowRoot)=>(()=>void)} disconnected_callback
	 * @param {(element:ShadowRoot)=>((prop_name:string,old_value:any,new_value:any)=>void)} attribute_changed_callback,
	 */
	constructor(
		tag,
		html_template,
		props,
		connected_callback,
		disconnected_callback,
		attribute_changed_callback
	) {
		this.tag = `h-${tag}`;
		this.props = props;
		window.customElements.define(
			this.tag,
			class extends HTMLElement {
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					template.innerHTML = html_template;
					this.shadowRoot.appendChild(template.content.cloneNode(true));
					this.connectedCallback = connected_callback(this.shadowRoot);
					this.disconnectedCallback = disconnected_callback(this.shadowRoot);
					this.attributeChangedCallback = attribute_changed_callback(this.shadowRoot);
				}
				static get observedAttribute() {
					const props__ = [];
					for (const prop in props) {
						props__.push(prop);
					}
					return props__;
				}
			}
		);
	}
}
