// @ts-check

import { $ } from '@html_first/simple_signal';
import { WebComponent } from './WebComponent.mjs';
import { Ping } from './Ping.mjs';
import { Let } from './Let.mjs';

/**
 * - handling looped tag
 * @template {{
 * [x: string]: ''
 * }} ListTemplate
 */
export class For {
	static forTag = new WebComponent({
		tagName: 'for',
		lifecycle: () => {
			return {
				htmlTemplate: '',
			};
		},
	});
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
		this.listTemplate = listTemplate;
		this.addParentElement = addParentElement;
		/**
		 * - data is generated to make the `childData` scoped on the `childData` instantiation scope, and to;
		 * - make `thisInstance.data` can be accessed outside the `childData` scope for `$` and stuffs;
		 */
		this.data = new Let([]);
		this.childElement = childElement;
		new $(async () => {
			this.reflectData(this.data.value);
		});
	}
	/**
	 * @private
	 */
	alreadyAssigned = false;
	/**
	 * @param {{
	 * assignData:()=>Promise<derivedListType["value"]>
	 * }} options
	 */
	tag = ({ assignData }) => {
		if (this.alreadyAssigned) {
			console.warn({
				alreadyAssigned: this.alreadyAssigned,
				message: '`For` can only be rendered in single tag',
				solution: "use `thisInstance.data`'s signal object to subscribe for changes",
			});
			return;
		}
		this.alreadyAssigned = true;
		return For.forTag.tag({
			connectedCallback: ({ shadowRoot }) => {
				Ping.scoped({
					documentScope: shadowRoot,
					scopedCallback: async () => {
						this.parentElement = shadowRoot;
						if (this.addParentElement) {
							shadowRoot.appendChild(this.addParentElement);
							const parent_ = shadowRoot.children[1];
							if (parent_ instanceof HTMLElement) {
								this.parentElement = parent_;
							}
						}
						this.data.value = await assignData();
					},
				});
			},
		});
	};
	/**
	 * @private
	 * @type {ListTemplate}
	 */
	listTemplate;
	/**
	 * @private
	 * @type {HTMLElement|ShadowRoot|undefined}
	 */
	addParentElement;
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
	 * @param {derivedListType["value"]} data
	 */
	reflectData = (data) => {
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
		const elementIndex = indexOrSignal;
		let dataIndex = indexOrSignal;
		if (this.addParentElement) {
			dataIndex--;
		}
		const child = this.parentElement.children[elementIndex];
		const childData = this.data.value[dataIndex];
		for (const attributeName in childData) {
			if (!(attributeName in this.listTemplate)) {
				continue;
			}
			childData[attributeName].removeAll$;
		}
		this.data.value.splice(dataIndex, 1);
		child.remove();
	};
}
