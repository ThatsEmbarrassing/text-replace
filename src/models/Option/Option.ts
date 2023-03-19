/**
 * @callback TransformFunctionCallback
 *
 * @param {string} value
 * @param {Array|undefined} args
 */

import { Arg } from "@/helpers";
import { ApplyOptionError } from "./errors/ApplyOptionError";

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
	public apply(value: string, args?: Args): string {
		try {
			return this.transform(value, args);
		} catch (error) {
			if (error instanceof Error) {
				throw new ApplyOptionError<Args>(this.name, value, args, error.message);
			} else throw new ApplyOptionError<Args>(this.name, value, args);
		}
	}

	private static parseArgs(argSeparator: string, args?: string): (string | number)[] | undefined {
		if (args !== undefined)
			return args.split(argSeparator).map((arg) => (Number.isNaN(Number(arg)) ? arg : Number(arg)));
		return args;
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
