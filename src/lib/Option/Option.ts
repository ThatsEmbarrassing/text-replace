/**
 * @callback TransformFunctionCallback
 *
 * @param {string} value
 * @param {Array|undefined} args
 */

import { ApplyOptionError, BaseError } from "@errors/custom";
import { Arg } from "@/helpers";

export type TransformFunction<Args extends Arg[]> = (value: string, args?: Args) => string;

interface TransformFunctionArgs {
	option: string;
	args?: Arg[];
}

export class Option<Args extends Arg[] = Arg[]> {
	/**
	 *
	 * @param {string} name - option's name
	 * @param {TransformFunctionCallback} transform
	 */
	constructor(public readonly name: string, private transform: TransformFunction<Args>) {}

	/**
	 * Transforms the given value and returns it
	 *
	 * @param {string} value - value what need to be changed
	 * @param {Array} args - array of given parameters. Can be undefined if there is no parameters to the option
	 * @returns {string}
	 */
	public apply(value: string, args?: Args): string | never {
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

	private static parseArgs(argSeparator: string, args?: string): Arg[] | undefined {
		if (args !== undefined) {
			return args.split(argSeparator).map((arg) => {
				if (!arg || arg === " ") return undefined;
				if (!Number.isNaN(Number(arg))) return Number(arg);
				else return arg;
			});
		}
	}

	/**
	 *
	 * @param {string} variableOption
	 * @param {object} argOptions
	 * @returns {TransformFunctionArgs}
	 */
	public static parse(variableOption: string, argSeparator: string): TransformFunctionArgs | null {
		const regex = new RegExp(`(?<option>[\\w+_\\-]{2,})(\\((?<args>(.+(${argSeparator})*))\\))?`, "ig");
		const result = regex.exec(variableOption);
		if (result) {
			const { groups } = result;
			if (groups) {
				return {
					option: groups.option,
					args: this.parseArgs(argSeparator, groups.args),
				};
			}
		}
		return null;
	}
}
