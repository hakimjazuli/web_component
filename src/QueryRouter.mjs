// @ts-check

import { LetURL } from './LetURL.mjs';

/**
 * - signal based query parameter;
 */
export class QueryRouter {
	/**
	 * @type {QueryRouter}
	 */
	static __;
	constructor() {
		if (QueryRouter.__ instanceof QueryRouter) {
			return;
		}
		QueryRouter.__ = this;
		window.addEventListener('click', QueryRouter.elementCheck);
	}
	/**
	 * @private
	 * Handles click events and checks if the click target or its ancestors match specific selectors.
	 * @param {MouseEvent} event - The click event.
	 */
	static elementCheck = (event) => {
		/** @type {HTMLElement | null} */
		let targetElement = null;
		const target = /** @type {HTMLElement | null} */ (event.target);
		if (target && (target.matches('a') || target.matches('button[type="submit"]'))) {
			targetElement = target;
		} else {
			let currentElement = target;
			while (currentElement) {
				if (currentElement instanceof ShadowRoot) {
					break;
				}
				if ('matches' in currentElement) {
					if (currentElement.matches('a')) {
						targetElement = currentElement;
						break;
					}
					if (currentElement.matches('button[type="submit"]')) {
						const form = currentElement.closest('form');
						if (form) {
							targetElement = currentElement;
							break;
						}
					}
				}
				currentElement = currentElement.parentElement;
			}
		}
		if (!targetElement) {
			return;
		}
		if (targetElement instanceof HTMLAnchorElement) {
			event.preventDefault();
			QueryRouter.handleUrl(new URL(targetElement.href ?? ''));
			return;
		}
		if (targetElement instanceof HTMLButtonElement) {
			event.preventDefault();
			const form = targetElement.closest('form');
			if (!form || !form.action) {
				return;
			}
			QueryRouter.handleUrl(new URL(form.action));
			return;
		}
	};
	/**
	 * @private
	 * @param {URL} url
	 */
	static handleUrl = (url) => {
		const queryParams = new URLSearchParams(url.search);
		for (const [key, value] of queryParams.entries()) {
			if (key in LetURL.queryList) {
				LetURL.queryList[key].value = value;
			}
		}
	};
}
