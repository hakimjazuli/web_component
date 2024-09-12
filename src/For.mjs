// @ts-check

import { $ } from '@html_first/simple_signal';
import { WebComponent } from './WebComponent.mjs';
import { Let } from './Let.mjs';

/**
 * - handling looped tag
 * @template {{
 * [x: string]: ''
 * }} ListTemplate
 */
export class For extends WebComponent {
	/**
	 * @typedef {Let<Array<Record<keyof NonNullable<ListTemplate>, Let<string>>>>} derivedListType
	 */
	/**
	 * @param {{
	 * listTemplate:ListTemplate,
	 * childElement:HTMLElement,
	 * addParentElement?:HTMLElement|ShadowRoot
	 * }} options
	 */
	constructor({ listTemplate, childElement, addParentElement }) {
		super({
			lifecycle: ({ shadowRoot }) => {
				return {
					htmlTemplate: '',
					connectedCallback: () => {
						this.listTemplate = listTemplate;
						this.shadowRoot = shadowRoot;
						this.parentElement = shadowRoot;
						if (addParentElement) {
							shadowRoot.appendChild(addParentElement);
							const parent_ = shadowRoot.children[1];
							if (parent_ instanceof HTMLElement) {
								this.parentElement = parent_;
							}
						}
						this.data = new Let([]);
						this.childElement = childElement;
						this.reflectData();
					},
				};
			},
		});
	}
	/**
	 * @private
	 * @type {ShadowRoot|HTMLElement}
	 */
	parentElement;
	/**
	 * @type {derivedListType}
	 */
	data;
	/**
	 * @private
	 */
	reflectData = () => {
		const data = this.data.value;
		const childElements = this.parentElement.children;
		for (let i = 0; i < data.length; i++) {
			if (!childElements[i]) {
				this.addChild(data[i]);
				continue;
			}
			this.reflectDataToDOM(i);
		}
		for (let i = data.length; i < childElements.length; i++) {
			this.removeChild[i];
		}
	};
	/**
	 * - no need to be public, as it can be controlled using instance.data.value[index][attributeOrPropName].value
	 * @private
	 * @param {number} index
	 */
	reflectDataToDOM = (index) => {
		const childData = this.data.value[index];
		for (const attributeName in childData) {
			childData[attributeName].call$();
		}
	};
	/**
	 * @param {Record<keyof NonNullable<ListTemplate>, Let<string>>} childData
	 */
	addChild = (childData) => {
		const childElement_ = this.childElement.cloneNode(true);
		if (!(childElement_ instanceof HTMLElement)) {
			return;
		}
		for (const attributeName in childData) {
			childElement_.setAttribute(childData[attributeName].attr, attributeName);
			childElement_.setAttribute(attributeName, childData[attributeName].value);
		}
		this.parentElement.append(childElement_);
	};
	/**
	 * @param {number|NaN|Let<string>} indexOrSignal
	 */
	removeChild = (indexOrSignal) => {
		if (indexOrSignal instanceof Let) {
			const child = this.parentElement.querySelector(`[${indexOrSignal.attr}]`);
			if (!child || !child.parentElement) {
				indexOrSignal = NaN;
			} else {
				indexOrSignal = Array.prototype.indexOf.call(child.parentElement.children, child);
			}
			if (typeof indexOrSignal !== 'number' || Number.isNaN(indexOrSignal)) {
				return;
			}
		}
		const child = this.parentElement.children[indexOrSignal];
		const childData = this.data.value[indexOrSignal];
		for (const attributeName in childData) {
			if (!(attributeName in this.listTemplate)) {
				continue;
			}
			childData[attributeName].removeAll$;
		}
		this.data.value.splice(indexOrSignal, 1);
		child.remove();
	};
}
