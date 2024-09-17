// @ts-check

import { $ } from '@html_first/simple_signal';
import { Let } from './Let.mjs';
import { spaHelper } from './spaHelper.mjs';
import { Ping } from './Ping.mjs';

/**
 * @description
 * allow the usage of search query based router through class instantiation;
 * - register by putting it in the instantiation of [App](#app)
 */
/**
 * Search-Query-Param Router
 * @template {{
 * [queryName:string]:
 * handlerType
 * }} dataValueType
 * @template {Extract<keyof dataValueType, string>} NamedQueryParam
 */
export class DefineQRouter {
	/**
	 * @type {DefineQRouter}
	 */
	static __;
	/**
	 * @private
	 * @typedef {Object} handlerType
	 * @property {string} [value]
	 * @property {NamedQueryParam[]} [clearQueriesWhenImSet]
	 * @property {NamedQueryParam[]} [clearAllQueriesExcept]
	 */
	handler = class {
		/**
		 * @param {handlerType} options
		 * - exception is prioritize to be kept;
		 */
		constructor({ value = '', clearQueriesWhenImSet = [], clearAllQueriesExcept = [] }) {
			this.string = Let.dataOnly(value);
			this.clearListWhenImSet = clearQueriesWhenImSet;
			this.clearAllQueriesExcept = clearAllQueriesExcept;
		}
	};
	/**
	 * @param {Object} options
	 * @param {dataValueType} options.data
	 * @param {number} [options.queryChangeThrottleMs]
	 */
	constructor({ data, queryChangeThrottleMs: queryChangeThrottle = 300 }) {
		if (DefineQRouter.__ instanceof DefineQRouter) {
			spaHelper.warningSingleton(DefineQRouter);
			return;
		}
		DefineQRouter.__ = this;
		// @ts-ignore
		this.data = {};
		this.queryChangeThrottle = queryChangeThrottle;
		const thisData = this.data;
		for (const key in data) {
			const keyData = new this.handler(data);
			const thisDataString = (this.data[key.toString()] = keyData.string);
			new $(async (first) => {
				const value = thisDataString.value;
				if (first) {
					return;
				}
				const exceptionSet = keyData.clearAllQueriesExcept;
				if (exceptionSet) {
					const placeHolder = {};
					for (const exception of exceptionSet) {
						placeHolder[exception.toString()] = thisData[exception].value;
					}
					for (const key in thisData) {
						if (key in thisData) {
							const keyStr = key.toString();
							if (key in exceptionSet) {
								thisData[key].value = placeHolder[keyStr];
							} else {
								thisData[key].value = '';
							}
						}
					}
				} else {
					const clearListWhenImSet = keyData.clearListWhenImSet;
					for (let i = 0; i < clearListWhenImSet.length; i++) {
						const queryNeedToBeClear = clearListWhenImSet[i];
						this.data[queryNeedToBeClear].value = '';
					}
				}
				this.requestChanges(this.pushPing);
			});
		}
		this.registerPopStateEventListener();
	}
	/**
	 * @private
	 * @param {Ping["ping"]} ping
	 */
	queryChangeThrottle;
	/**
	 * @private
	 * @type { null|number }
	 */
	timeoutId = null;
	/**
	 * @private
	 * @param {Ping["ping"]} ping
	 */
	requestChanges = async (ping) => {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = window.setTimeout(async () => {
			ping();
		}, this.queryChangeThrottle);
	};
	/**
	 * @private
	 */
	pushPing = Ping.unScopedOnCall(async () => {
		const queryParams = {};
		const currentData = this.data;
		for (const key in currentData) {
			const query = currentData[key].value;
			if (query) {
				queryParams[key.toString()] = query;
			}
		}
		const url = new URL(window.location.href);
		const initialSearch = url.search;
		url.search = '';
		for (const key in queryParams) {
			url.searchParams.set(key, queryParams[key]);
		}
		if (initialSearch == url.search) {
			return;
		}
		window.history.pushState({}, '', url);
	});
	currentQuery = Let.dataOnly('');
	/**
	 * @private
	 */
	registerPopStateEventListener = () => {
		window.addEventListener('popstate', () => this.requestChanges(this.popPing));
	};
	/**
	 * @private
	 */
	popPing = Ping.unScopedOnCall(async () => {
		const url = new URL(window.location.href);
		const searchParams = url.searchParams;
		for (const key in searchParams) {
			const thisData = this.data;
			if (!(key in thisData)) {
				continue;
			}
			if (Object.prototype.hasOwnProperty.call(searchParams, key)) {
				const query = searchParams[key];
				thisData[key].value = query;
			}
		}
	});
	/**
	 * @type {Record.<NamedQueryParam, Let<string>>}
	 */
	data;
}
