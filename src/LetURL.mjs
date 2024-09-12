// @ts-check

import { Let as Let_ } from './Let.mjs';
import { Ping as Ping_ } from './Ping.mjs';
import { $ } from '@html_first/simple_signal';

export class LetURL {
	/**
	 * @type {{
	 * [name:string]: Let_<string>
	 * }}
	 */
	static queryList = {};
	/**
	 * @param {string} paramName
	 * @param {string} paramValue
	 */
	static updateQueryParams = (paramName, paramValue) => {
		const url = new URL(window.location.href);
		url.searchParams.set(paramName, paramValue);
		history.pushState(null, '', url.toString());
	};
	/**
	 * query
	 * @type {Let_<string>}
	 */
	query;
	/**
	 * @private
	 * @type {string}
	 */
	paramName;
	/**
	 * @private
	 * @type {Ping_|null}
	 */
	queryChangePing;
	/**
	 * @param {{
	 * name:string,
	 * value?:string,
	 * onRouteChangedCallback?:(currentQueryValue:string)=>Promise<void>
	 * }} options
	 */
	constructor({ name, value = undefined, onRouteChangedCallback = async () => {} }) {
		this.paramName = name;
		if (value === undefined) {
			const url = new URL(window.location.href);
			value = url.searchParams.get(name) || '';
		}
		this.query = new Let_(value);
		LetURL.queryList[name] = this.query;
		this.queryChangePing = new Ping_(async (first) => {
			if (first) {
				return;
			}
			onRouteChangedCallback(this.query.value);
		});
		new $(async () => {
			const val = this.query.value;
			LetURL.updateQueryParams(name, val);
			if (this.queryChangePing) {
				this.queryChangePing.ping();
			}
		});
	}
	unSub = () => {
		this.query.removeAll$();
		delete LetURL.queryList[this.paramName];
		this.queryChangePing = null;
	};
}
