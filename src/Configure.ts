import { Option, Value } from "./lib";
import { Template } from "./lib/Template/Template";
import { TemplateOptions } from "@/helpers";
import {
	DefaultErrorHandler,
	ApplyOptionErrorHandler,
	ErrorHandle,
	GetValueErrorHandler,
} from "./errors/ErrorHandlers/";

export interface ConfigureVariable {
	name: string;
	value: Value;
	options: Option[];
}

export interface ConfigureOptions {
	variables: ConfigureVariable[];
	globalOptions: Option[];
	templateOptions?: Partial<TemplateOptions>;
	errorHandle?: ErrorHandle;
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
	const { globalOptions, variables, errorHandle = new ErrorHandle(), templateOptions = {} } = options;

	errorHandle.use("GET_VALUE_ERROR", new GetValueErrorHandler());
	errorHandle.use("APPLY_OPTION_ERROR", new ApplyOptionErrorHandler());
	errorHandle.use("default", new DefaultErrorHandler());

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
		try {
			return template.render(text, templateOptions);
		} catch (err) {
			const error = err as Error;

			errorHandle.handle(error.name, error);
		}
	};
}

export { ErrorHandle };
