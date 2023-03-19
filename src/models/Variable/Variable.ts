import { find, isAlreadyExist } from "@/helpers";
import { Option } from "../Option/Option";

export type Value = string | (() => string);

/**
 * @callback ValueCallback
 * @returns {string}
 */

export class Variable {
	private options: Option[] = [];

	/**
	 *
	 * @param {string} name - Variable's name
	 * @param {string|ValueCallback} value - Variable's value
	 */
	constructor(public readonly name: string, public value: Value) {}

	/**
	 * Adds new variable's option
	 *
	 * @param {Option} option
	 */
	public addOption(option: Option): void {
		const isExist = this.isOptionAlreadyExist(option.name);

		if (!isExist) {
			this.options.push(option);
		}
	}

	/**
	 * Finds the option by name. If it does, returns this option, undefined otherwise.
	 *
	 * @param {string} name - name of the option what you need to find
	 * @returns {Option|undefined}
	 */
	public findOption(name: string): Option | undefined {
		return find(this.options, name);
	}

	private isOptionAlreadyExist(name: string): boolean {
		return isAlreadyExist(this.options, name);
	}

	/**
	 *
	 * @returns {string}
	 */
	public getValue(): string {
		const value = typeof this.value === "function" ? this.value() : this.value;

		return value;
	}

	/**
	 *
	 * @returns {Option[]}
	 */
	public getOptions(): Option[] {
		return this.options.slice();
	}
}
