// @ts-check

import { Let as Let_ } from '@html_first/simple_signal';
import { spaHelper } from './spaHelper.mjs';

/**
 * @template V
 * @extends {Let_<V>}
 */
export class Let extends Let_ {
	/**
	 * @param {V} value
	 * @param {import('@html_first/simple_signal').documentScope} [documentScope]
	 */
	constructor(value, documentScope = spaHelper.currentDocumentScope) {
		super(value, spaHelper.attributeIndexGenerator(), documentScope);
		this.documentScope = documentScope;
	}
	/** @type {string} */
	attr = spaHelper.attr;
}
