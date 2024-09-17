// @ts-check

import { $ } from '@html_first/simple_signal';
import { Let } from './Let.mjs';
import { spaHelper } from './spaHelper.mjs';

/**
 * @description
 * create named storage (`localStorage` or `sessionStorage`) through class instantiation;
 * - register by putting it in the instantiation of [App](#app)
 */
export class DefineStorage {
	/**
	 * @type {DefineStorage}
	 */
	static __;
	/**
	 * @typedef {{[uniqueName:string]:string}} storageType
	 * - value is for defaultValue;
	 * @param {Object} data
	 * @param {storageType} [data.local]
	 * @param {storageType} [data.session]
	 */
	constructor({ local, session }) {
		if (DefineStorage.__ instanceof DefineStorage) {
			spaHelper.warningSingleton(DefineStorage);
			return;
		}
		DefineStorage.__ = this;
		if (local) {
			this.defaultLocal = local;
		}
		if (session) {
			this.defaultSession = session;
		}
		for (const key in local) {
			this.resolve('local', key, local[key]);
		}
		for (const key in session) {
			this.resolve('session', key, session[key]);
		}
		this.autoDeprecate();
	}
	/**
	 * @type { storageType }
	 */
	defaultLocal;
	/**
	 * @type { storageType }
	 */
	defaultSession;
	/**
	 * @private
	 */
	static identifier = 'atla-as-wc-storage';
	/**
	 * @private
	 * @param {string} name
	 * @returns {string}
	 */
	static nameSpace = (name) => {
		return `${DefineStorage.identifier}-${name}`;
	};
	/**
	 * @typedef {{[uniqueName:string]:Let<string>}} storageSignalType
	 * @param {storageSignalType} local
	 * @param {storageSignalType} session
	 */
	data = Let.dataOnly({ local: {}, session: {} });
	/**
	 * @private
	 * @param {"session"|"local"} storage
	 * @param {string} name
	 * @param {string} defaultValue
	 */
	resolve = (storage, name, defaultValue) => {
		name = DefineStorage.nameSpace(name);
		let storageMode;
		switch (storage) {
			case 'local':
				storageMode = localStorage;
				break;
			case 'session':
				storageMode = sessionStorage;
				break;
		}
		const keyIsExist = storageMode.getItem(name);
		let store;
		if (keyIsExist) {
			store = this.data.value[storage][name] = Let.dataOnly(keyIsExist);
		} else {
			store = this.data.value[storage][name] = Let.dataOnly(defaultValue);
		}
		new $(async () => {
			storageMode.setItem(name, store.value);
		});
	};
	refreshLocal = () => {
		const localKeys = Object.keys(localStorage);
		for (const key of localKeys) {
			if (!key.startsWith(DefineStorage.identifier)) {
				continue;
			}
			localStorage.removeItem(key);
			this.resolve('local', key, this.defaultLocal[key]);
		}
	};
	refreshSession = () => {
		const sessionKeys = Object.keys(sessionStorage);
		for (const key of sessionKeys) {
			if (!key.startsWith(DefineStorage.identifier)) {
				continue;
			}
			sessionStorage.removeItem(key);
			this.resolve('session', key, this.defaultSession[key]);
		}
	};
	refreshBoth = () => {
		this.refreshLocal();
		this.refreshSession();
		this.autoDeprecate();
	};
	/**
	 * @private
	 * delete previously set by app, but no longer on the list;
	 */
	autoDeprecate = () => {
		const sessionKeys = Object.keys(sessionStorage);
		const sessionCompare = Object.keys(this.data.value.session);
		for (const key of sessionKeys) {
			if (key.startsWith(DefineStorage.identifier) && !sessionCompare.includes(key)) {
				sessionStorage.removeItem(key);
			}
		}
		const localKeys = Object.keys(localStorage);
		const localComapare = Object.keys(this.data.value.local);
		for (const key of localKeys) {
			if (key.startsWith(DefineStorage.identifier) && !localComapare.includes(key)) {
				localStorage.removeItem(key);
			}
		}
	};
}
