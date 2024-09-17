// @ts-check

/**
 * @description
 * html-literal syntax helper
 * - `lit` has amazing .vs-code plugin to highlight and format template literal, install `lit-plugin`;
 * - problem is, it needs to be wiriten like with templateStingArray function
 * ```js
 * htmlLiteral`${htmlStringLiterals}`;
 * ```
 * - so this is just function helper to achieve that, without installing lit on your project;
 * - technically we can use html, but it somehow messes with `autoImport`;
 * - you need to configure `lit-plugin` settings to assign `htmlLiteral`, and if any `lit-plugin` errors shows up;
 * - why `lit-plugin`;
 * > - it's the best plugin for handling html literals in js that is true to keep tracks `<style></style>` css syntax (not showing weird css in js syntax like `camellCase`/`pascalCase` just because it's on `js` file);
 */
/**
 * @param {TemplateStringsArray} strings
 * @param {string[]} values
 */
export const htmlLiteral = (strings, ...values) => {
	const result = [];
	for (let i = 0; i < strings.length; i++) {
		result.push(strings[i]);
		if (i < values.length) {
			result.push(values[i]);
		}
	}
	return result.join('');
};
