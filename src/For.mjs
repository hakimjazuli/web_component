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
	 * data:Let<Array<Record<keyof NonNullable<ListTemplate>, string>>>,
	 * addParentElement?:HTMLElement|ShadowRoot
	 * }} options
	 */
	constructor({ listTemplate, data, childElement, addParentElement }) {
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
						const check = new $(async () => {
							this.overwriteData(data.value);
						});
						return {
							disconnectedCallback: () => {
								data.remove$(check);
								this.data.removeAll$();
							},
						};
					},
				};
			},
		});
	}
	/**
	 * @private
	 * @type {ShadowRoot}
	 */
	shadowRoot;
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
	 * @param {Array<Record<keyof NonNullable<ListTemplate>, string>>} overwriteData
	 */
	overwriteData = (overwriteData) => {
		const realData = this.data.value;
		for (let i = 0; i < overwriteData.length; i++) {
			const newData_ = overwriteData[i];
			const realData_ = realData[i];
			if (!realData_) {
				this.addChild(newData_);
			} else {
				this.editData(newData_, i);
			}
		}
		for (let i = overwriteData.length; i < realData.length; i++) {
			let index = i;
			if (this.parentElement instanceof ShadowRoot) {
				index = index + 1;
			}
			this.removeChild(index);
		}
	};
	/**
	 * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
	 * @param {number} index
	 */
	editData = (newData, index) => {
		const thisData = this.data.value[index];
		for (const attr in newData) {
			if (!(attr in this.listTemplate)) {
				continue;
			}
			const thisDataAttr = thisData[attr];
			if (thisDataAttr.value != newData[attr]) {
				thisDataAttr.value = newData[attr];
			}
		}
	};
	/**
	 * @param {Record<keyof NonNullable<ListTemplate>, string>} newData
	 */
	addChild = (newData) => {
		const generateData = {};
		const i = this.data.value.length + 1;
		for (const attr in newData) {
			if (!(attr in this.listTemplate)) {
				continue;
			}
			const attrString = attr.toString();
			generateData[attrString] = new Let(newData[attr]);
			new $(async (first) => {
				const value = generateData[attrString].value;
				if (first) {
					return;
				}
				this.data.value[i][attr] = new Let(value);
			});
		}
		// @ts-ignore by pass from data construction
		this.data.value.push(generateData);
		// @ts-ignore by pass from data construction
		const childElement = this.generateChild(generateData);
		this.parentElement.append(childElement);
	};
	/**
	 * @param {number|NaN|Let<string>} indexOrSignal
	 */
	removeChild = (indexOrSignal) => {
		if (indexOrSignal instanceof Let) {
			const child = this.shadowRoot.querySelector(`[${indexOrSignal.attr}]`);
			if (!child || !child.parentElement) {
				indexOrSignal = NaN;
			} else {
				indexOrSignal = Array.prototype.indexOf.call(child.parentElement.children, child);
			}
			if (typeof indexOrSignal !== 'number' || Number.isNaN(indexOrSignal)) {
				return;
			}
		}
		const realdData = this.data;
		const realData_ = realdData[indexOrSignal];
		for (const attribute in realData_) {
			if (!(attribute in this.listTemplate)) {
				continue;
			}
			const tracker = realData_[attribute];
			if (tracker instanceof Let) {
				tracker.removeAll$();
			}
		}
		if (this.parentElement instanceof ShadowRoot) {
			this.parentElement.children[indexOrSignal + 1].remove();
		} else {
			this.parentElement.children[indexOrSignal].remove();
		}
		realdData.value.splice(indexOrSignal, 1);
	};
	/**
	 * @private
	 * - not a static method, so `ListTemplate` can be used to typehint;
	 * @param {Record<keyof NonNullable<ListTemplate>, Let<string>>} data
	 * @returns {HTMLElement|Node}
	 */
	generateChild = (data) => {
		const childElement_ = this.childElement.cloneNode(true);
		for (const attributeName in data) {
			if (!(attributeName in this.listTemplate)) {
				continue;
			}
			const attributeData = data[attributeName];
			if (childElement_ instanceof HTMLElement) {
				childElement_.setAttribute(attributeData.attr, attributeName);
				const attributeName_ = attributeName.toString();
				try {
					if (!(attributeName in childElement_)) {
						throw '';
					}
					if (childElement_[attributeName_] != attributeData.value) {
						childElement_[attributeName_] = attributeData.value;
					}
				} catch (error) {
					if (attributeData.value != childElement_.getAttribute(attributeName_) ?? '') {
						childElement_.setAttribute(attributeName_, attributeData.value);
					}
				}
			}
		}
		return childElement_;
	};
}
