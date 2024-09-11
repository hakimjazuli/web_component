// @ts-check

import { $ } from '@html_first/simple_signal';
import { WebComponent } from './WebComponent.mjs';
import { Derived } from './Derived.mjs';

/**
 * - handling conditional string as `innerHTML`;
 *   > -   `WARNING!!!`: you better make sure the data is safe;
 */
export class If {
	/**
	 * @private
	 */
	static IfTag = new WebComponent({
		tagName: 'if',
		lifecycle: () => {
			return {
				htmlTemplate: '',
			};
		},
	});
	/**
	 * @param {()=>Promise<string>} stringLogic
	 */
	static tag = (stringLogic) => {
		const elem = If.IfTag.tag({
			connectedCallback: ({ shadowRoot }) => {
				const derivedString = new Derived(stringLogic);
				new $(async () => {
					shadowRoot.innerHTML = derivedString.value;
				});
				return {
					disconnectedCallback: () => {
						derivedString.removeAll$();
					},
				};
			},
		});
		return elem;
	};
}
