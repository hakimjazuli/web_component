// @ts-check

import { $ } from '@html_first/simple_signal';
import { Let } from './Let.mjs';

export class Storage {
	/**
	 * @type {Storage}
	 */
	static __;
	/**
	 * @typedef {{[uniqueName:string]:string}} storageType
	 * - value is for defaultValue;
	 * @param {{
	 * local?:storageType,
	 * session?:storageType,
	 * }} data
	 */
	constructor({ local, session }) {
		if (Storage.__ instanceof Storage) {
			return;
		}
		Storage.__ = this;
		for (const key in local) {
			this.resolve('local', key, local[key]);
		}
		for (const key in session) {
			this.resolve('session', key, session[key]);
		}
	}
	/**
	 * @private
	 */
	static identifier = 'atla-as-wc-storage';
	/**
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	static scopedName = (name) => {
		return `${Storage.identifier}-${name}`;
	};
	/**
	 * @typedef {{[uniqueName:string]:Let<string>}} storageSignalType
	 * @param {storageSignalType} local
	 * @param {storageSignalType} session
	 */
	data = new Let({ local: {}, session: {} });
	/**
	 * @private
	 * @param {"session"|"local"} storage
	 * @param {string} name
	 * @param {string} defaultValue
	 */
	resolve = (storage, name, defaultValue) => {
		name = Storage.scopedName(name);
		let storageMode;
		if (storage === 'local') {
			storageMode = localStorage;
		} else {
			storageMode = sessionStorage;
		}
		const keyIsExist = storageMode.getItem(name);
		if (keyIsExist) {
			this.data.value[storage][name] = new Let(keyIsExist);
		} else {
			this.data.value[storage][name] = new Let(defaultValue);
		}
		new $(async () => {
			storageMode.setItem(name, this.data.value[storage][name].value);
		});
	};
}
