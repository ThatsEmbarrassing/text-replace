import { AbstractArgumentsHandler, Option, Value, TransformFunction } from "./lib";
import { Template } from "./lib/Template/Template";
import { Arg, TemplateOptions } from "@/helpers";
import {
	DefaultErrorHandler,
	ApplyOptionErrorHandler,
	ErrorHandle,
	GetValueErrorHandler,
} from "./errors/ErrorHandlers/";

export interface ConfigureVariable {
	/**
	 * Variable's name.
	 */
	name: string;
	/**
	 * Variable's value.
	 */
	value: Value;
	/**
	 * Variable's options to transform only its value.
	 */
	options: ConfigureOption[];
}

export interface ConfigureOption<Args extends Arg[] = Arg[]> {
	/**
	 * Option's name
	 */
	name: string;
	/**
	 * Function that changes the variable's value
	 */
	transform: TransformFunction<Args | []>;
}

export interface ReplaceConfiguration {
	/**
	 * Your variables.
	 */
	variables: ConfigureVariable[];
	/**
	 * Global options to transform any variable.
	 */
	globalOptions: ConfigureOption[];
	/**
	 * Template options to customize the template in the text.
	 */
	templateOptions?: Partial<TemplateOptions>;
	/**
	 * To handle your own errors.
	 */
	errorHandle?: ErrorHandle;
	/**
	 * Argument handlers. It's needed to handle your own arguments. See more:
	 */
	argumentHandlers?: AbstractArgumentsHandler[];
}

/**
 * Returns replace function that calls render method of the configured template object
 *
 * @param {object} options
 */

export function Configure(options: ReplaceConfiguration) {
	const {
		globalOptions,
		variables,
		errorHandle = new ErrorHandle(),
		templateOptions = {},
		argumentHandlers = [],
	} = options;

	errorHandle.use("GET_VALUE_ERROR", new GetValueErrorHandler());
	errorHandle.use("APPLY_OPTION_ERROR", new ApplyOptionErrorHandler());
	errorHandle.use("default", new DefaultErrorHandler());

	const template = new Template();

	Option.setHandlers(argumentHandlers);

	variables.forEach(({ name, options, value }) => {
		template.addVariable({ name, value });
		options.forEach((option) => {
			template.addLocalOption(new Option(option.name, option.transform), name);
		});
	});

	globalOptions.forEach((option) => {
		template.addGlobalOption(new Option(option.name, option.transform));
	});

	return function replace(text: string) {
		try {
			return template.render(text, templateOptions);
		} catch (err) {
			const error = err as Error;

			errorHandle.handle(error);
		}
	};
}
