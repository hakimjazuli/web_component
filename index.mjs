// @ts-check

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
export class CustomElement {
	/**
	 * @param {{
	 * props?:Record.<Prop, string>,
	 * slots?:Record.<SlotName, HTMLElement>
	 * }} [options]
	 * @returns {HTMLElement|Element}
	 */
	makeElement = (options) => {
		const element = document.createElement(this.TNV);
		if (options) {
			const { props = {}, slots = {} } = options;
			for (const prop in props) {
				element.setAttribute(prop, props[prop]);
			}
			for (const slotName in slots) {
				const childElement = slots[slotName];
				childElement.setAttribute('slot', slotName);
				element.appendChild(childElement);
			}
		}
		return element;
	};
	/**
	 * @private
	 * @type {string}
	 */
	TNV;
	/**
	 * @typedef CustomElementParameters
	 * @property {string} tagName
	 * @property {defaultProps} defaultProps
	 * @property {(create_slot:(slot_name:SlotName,attributes?:Record.<string,string>)=>string)=>string} htmlTemplate
	 * - create_slots: function that generate slot string;
	 * @property {(HTMLElement:HTMLElement & {shadowRoot:ShadowRoot})=>({
	 * disconnectedCallback:()=>void,
	 * attributeChangedCallback: (propName:Prop, oldValue:string, newValue:string)=>void,
	 * adoptedCallback?:()=>void,
	 * })} connectedCallback
	 * @property {string} [tagPrefix]
	 * @property {Slots} [slots]
	 */
	/**
	 * @param {CustomElementParameters} options
	 */
	constructor(options) {
		const {
			tagName,
			defaultProps,
			htmlTemplate,
			connectedCallback,
			tagPrefix = 'hf-wc',
			slots,
		} = options;
		this.TNV = `${tagPrefix}-${tagName}`
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-+/g, '-');
		let disconnectedCallback;
		let attributeChangedCallback;
		let adoptedCallback;
		let observedAttributes = [];
		for (const prop in defaultProps) {
			observedAttributes.push(prop);
		}
		customElements.define(
			this.TNV,
			class extends HTMLElement {
				/**
				 * @type {ShadowRoot}
				 */
				shadowRoot;
				constructor() {
					super();
					this.shadowRoot = this.attachShadow({ mode: 'open' });
					const template = document.createElement('template');
					template.innerHTML = htmlTemplate((slot_name, attributes) => {
						const attrs_ = [];
						for (const attribute in attributes) {
							attrs_.push(`${attribute}="${attributes[attribute]}"`);
						}
						return /* HTML */ `<slot
							name="${slot_name.toString()}"
							${attrs_.join(' ')}
						></slot>`;
					});
					this.shadowRoot.appendChild(template.content.cloneNode(true));
				}
				static get observedAttributes() {
					return observedAttributes;
				}
				connectedCallback() {
					({
						disconnectedCallback,
						attributeChangedCallback,
						adoptedCallback = undefined,
					} = connectedCallback(this));
					for (const prop in defaultProps) {
						this.setAttribute(prop, defaultProps[prop]);
					}
				}
				async disconnectedCallback() {
					disconnectedCallback();
				}
				/**
				 * @param {Prop} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					attributeChangedCallback(propName, oldValue, newValue);
				}
				adoptedCallback() {
					if (adoptedCallback) {
						adoptedCallback();
					}
				}
			}
		);
	}
}
