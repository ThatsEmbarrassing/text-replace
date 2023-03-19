import { Option, Value } from "./models";
import { Template, TemplateOptions } from "./Template";

export interface ConfigureVariable {
	name: string;
	value: Value;
	options: Option[];
}

export interface ConfigureOptions {
	variables: ConfigureVariable[];
	globalOptions: Option[];
	templateOptions?: Partial<TemplateOptions>;
}

/**
 *
 * @typedef {Object} ConfigureVariable
 * @property {string} name
 * @property {value} value
 * @property {Option[]} options
 */

/**
 * @typedef {Object} ConfigureOptions
 * @property {ConfigureVariable[]} variables
 * @property {Option[]} globalOptions
 * @property {boolean} overwrite
 */

/**
 * Returns replace function that calls render method of the configured template object
 *
 * @param {ConfigureOptions} options
 */
export function Configure(options: ConfigureOptions) {
	const { globalOptions, variables, templateOptions = {} } = options;

	const template = new Template();

	variables.forEach(({ name, options, value }) => {
		template.addVariable({ name, value });
		options.forEach((option) => {
			template.addLocalOption(option, name);
		});
	});

	globalOptions.forEach((option) => {
		template.addGlobalOption(option);
	});

	return function replace(text: string) {
		return template.render(text, templateOptions);
	};
}
