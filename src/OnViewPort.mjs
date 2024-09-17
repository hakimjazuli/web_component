// @ts-check

import { OnViewPort as OnViewPort_ } from '@html_first/simple_signal';
import { spaHelper } from './spaHelper.mjs';

/**
 * @description
 * monitor element attached with Intstance `attr` property
 * ```js
 * // in WebComponent scope
 * const componentExample = new WebComponent({
 * 	lifecycle:()=>{
 * 		const onViewPortExample = new OnViewPort(options);
 * 		return {
 * 			htmlTemplate: htmlLiteral`<div ${onViewPortExample.attr}></div>`
 * 			}
 * 		}
 * 	})
 * ```
 */
export class OnViewPort extends OnViewPort_ {
	/**
	 * @param {(element:IntersectionObserverEntry['target'])=>Promise<void>} OnViewCallback
	 * @param {(element:IntersectionObserverEntry['target'], unObserve:()=>void)=>Promise<void>} [onExitingViewport]
	 * @param {import('@html_first/simple_signal').documentScope} documentScope
	 * undefined: will automatically fires unObserve callback;
	 */
	constructor(OnViewCallback, onExitingViewport, documentScope = spaHelper.currentDocumentScope) {
		super(
			spaHelper.attributeIndexGenerator() ?? '',
			OnViewCallback,
			onExitingViewport,
			documentScope
		);
	}
	attr = spaHelper.attr;
}
