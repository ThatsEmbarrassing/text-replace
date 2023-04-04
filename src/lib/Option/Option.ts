import { ApplyOptionError, BaseError } from "@errors/custom";
import { Arg, stringSlice } from "@/helpers";
import { AbstractArgumentsHandler } from "./lib/AbstractArgumentsHandler";
import { UndefinedArgumentsHandler } from "./lib/UndefinedArgumentsHandler";
import { NumberArgumentsHandler } from "./lib/NumberArgumentsHandler";
import { parseArgs } from "@/helpers/parseArgs";
import { between } from "@/helpers/between";
import { InitialArgumentsHandler } from "./lib/InitialArgumentsHandler";

/**
 * @param value - variable's value
 * @param args - option's args
 */
export type TransformFunction<Args extends Arg[]> = (value: string, args: Args) => string;

interface TransformFunctionArgs {
	/**
	 * Found option name
	 */
	option: string;
	/**
	 * Option's args
	 */
	args: Arg[];
}

const initialHandler = new InitialArgumentsHandler();
const undefinedHandler = new UndefinedArgumentsHandler();
const numberHandler = new NumberArgumentsHandler();

initialHandler.setNext(undefinedHandler).setNext(numberHandler);

export class Option<Args extends Arg[] = Arg[]> {
	private static handler: AbstractArgumentsHandler = initialHandler;

	/**
	 *
	 * @param {string} name - option's name
	 * @param transform - function that changes variable's value
	 */
	constructor(public readonly name: string, private transform: TransformFunction<Args | []>) {}

	public static setHandlers(argumentHandlers: AbstractArgumentsHandler[] = []): void {
		argumentHandlers.reduce((acc, currentHandler) => acc.setNext(currentHandler), this.handler);
	}

	/**
	 * Transforms the given value and returns it
	 *
	 * @param {string} value - value what need to be changed
	 * @param {Array} args - array of given parameters. Can be undefined if there is no parameters to the option
	 * @returns {string}
	 */
	public apply(value: string, args: Args): string | never {
		try {
			return this.transform(value, args);
		} catch (error) {
			if (error instanceof BaseError) {
				throw error;
			}
			if (error instanceof Error) {
				throw new ApplyOptionError({
					optionName: this.name,
					value,
					args,
					errorMessage: error.message,
				});
			} else throw new Error(`Expected thrown error, but got ${String(error)}`);
		}
	}

	/**
	 *
	 * @param variableOption - found option in the template
	 * @param argSeparator - arguments separator
	 */
	public static parse(variableOption: string, argSeparator: string): TransformFunctionArgs {
		const result = between(variableOption, "(", ")");

		const args: Arg[] = result ? parseArgs(Option.handler, argSeparator, stringSlice(result.string, 1, -1)) : [];

		return {
			option: variableOption.split("(")[0],
			args,
		};
	}
}

export { AbstractArgumentsHandler };
