// @ts-check

import { Derived as Derived_ } from '@html_first/simple_signal';
import { spaHelper } from './spaHelper.mjs';

/**
 * - signal based reactivity, wich value are derived from `Let<T>.value`;
 * @template V
 * @extends {Derived_<V>}
 */
export class Derived extends Derived_ {
	attr = spaHelper.attr;
	/**
	 * @param {()=>Promise<V>} asyncCallback
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 */
	constructor(asyncCallback, documentScope = spaHelper.currentDocumentScope) {
		super(asyncCallback, spaHelper.attributeIndexGenerator(), documentScope);
	}
}
