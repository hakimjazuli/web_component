// @ts-check

let tag_index = 1;

const generateTag = () => {
	let remainder = (tag_index - 1) % 26;
	tag_index = Math.floor((tag_index - 1) / 26);
	const result = String.fromCharCode(97 + remainder) + '';
	return result;
};

/**
 * @param {string} string
 * @returns {string}
 */
const validateHtmlTagAttrName = (string) => {
	return string
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-+/g, '-');
};

/**
 * @template {{
 * [x: string]: ''
 * }} attrHelpers
 * @template {keyof NonNullable<attrHelpers>} attrHelperValue
 */
export class AttrHelpers {
	/**
	 * @private
	 * @type {attrHelpers}
	 */
	H;
	/**
	 * @param {attrHelperValue} attrHelperValue
	 * @returns {string}
	 */
	validate = (attrHelperValue) => {
		// @ts-ignore
		return validateHtmlTagAttrName(attrHelperValue);
	};
	/**
	 * @param {attrHelpers} attrHelpers
	 */
	constructor(attrHelpers) {
		this.H = attrHelpers;
	}
}

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
export class CustomTag {
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
			const { props, slots } = options;
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
	 * @property {defaultProps} defaultProps
	 * @property {(
	 * create_slot:(slot_name:SlotName,attributes?:Record.<string,string>)=>string
	 * )=>{
	 * htmlTemplate: string,
	 * connectedCallback:(shadwRoot:ShadowRoot,element:HTMLElement)=>{
	 * disconnectedCallback:()=>void,
	 * attributeChangedCallback:(propName:Prop, oldValue:string, newValue:string)=>void,
	 * adoptedCallback?:()=>void,
	 * },
	 * }} lifecycle
	 * @property {string} [tagPrefix]
	 * @property {Slots} [slots]
	 * @property {string} [tagName]
	 */
	/**
	 * @param {CustomElementParameters} options
	 */
	constructor(options) {
		const {
			defaultProps,
			lifecycle,
			tagPrefix = 'hf-wc',
			tagName = generateTag(),
			slots,
		} = options;
		this.TNV = validateHtmlTagAttrName(`${tagPrefix}-${tagName}`);
		let htmlTemplate;
		let connectedCallback;
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
					({ htmlTemplate, connectedCallback } = lifecycle((slot_name, attributes) => {
						const attrs_ = [];
						for (const attribute in attributes) {
							attrs_.push(`${attribute}="${attributes[attribute]}"`);
						}
						return /* HTML */ `<slot
							name="${slot_name.toString()}"
							${attrs_.join(' ')}
						></slot>`;
					}));
					template.innerHTML = htmlTemplate;
					this.shadowRoot.appendChild(template.content.cloneNode(true));
				}
				static get observedAttributes() {
					return observedAttributes;
				}
				connectedCallback() {
					({
						disconnectedCallback,
						attributeChangedCallback,
						adoptedCallback = () => {},
					} = connectedCallback(this.shadowRoot, this));
					for (const prop in defaultProps) {
						if (this.hasAttribute(prop)) {
							this.setAttribute(prop, this.getAttribute(prop) ?? '');
							continue;
						}
						this.setAttribute(prop, defaultProps[prop]);
					}
				}
				async disconnectedCallback() {
					if (disconnectedCallback) {
						disconnectedCallback();
					}
				}
				/**
				 * @param {Prop} propName
				 * @param {string} oldValue
				 * @param {string} newValue
				 */
				attributeChangedCallback(propName, oldValue, newValue) {
					if (attributeChangedCallback) {
						attributeChangedCallback(propName, oldValue, newValue);
					}
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
