import { find, isAlreadyExist, render, TemplateOptions } from "@/helpers";
import type { Arg } from "@/helpers";

import { Option } from "../Option/Option";

import { Variable } from "../Variable/Variable";
import type { Value } from "../Variable/Variable";

interface IVariableObject<Variables extends string> {
	name: Variables;
	value: Value;
}

/**
 * @typedef {Object} TransformFunctionArgs
 * @property {string} option - option's name
 * @property {Array | undefined} args - option's args
 */

export class Template<Variables extends string = string> {
	private readonly variables: Variable[] = [];
	private options: Option[] = [];

	/**
	 * Splits args by argSeparator and returns array of values.
	 * If args is undefined, returns it
	 *
	 * For example:
	 *
	 * 		this.parseArgs(", ", "1, 2, 3") -> [1, 2, 3]
	 * 		this.parseArgs("_", "1_2_3") -> [1, 2, 3]
	 * 		this.parseArgs("|", undefined) -> undefined
	 *
	 * @param {string} argSeparator - string separator
	 * @param {string} args - option's arguments
	 * @returns {string[] | undefined}
	 */

	/**
	 *
	 * @param {string} name
	 * @returns {Option | undefined}
	 */
	private findGlobalOption(name: string): Option | undefined {
		return find(this.options, name);
	}

	/**
	 *
	 * @param {string} name
	 * @returns {Option | undefined}
	 */
	private findVariableOption(variableName: string, optionName: string): Option | undefined {
		const variable = this.findVariable(variableName);
		return variable?.findOption(optionName);
	}

	private findVariable(name: string): Variable | undefined {
		return find(this.variables, name);
	}

	private isOptionAlreadyExist(name: string): boolean {
		return isAlreadyExist(this.options, name);
	}

	private isVariableAlreadyExist(name: string): boolean {
		return isAlreadyExist(this.variables, name);
	}

	/**
	 *
	 * @param {string} name
	 * @returns {Option | undefined}
	 */
	/**
	 * Transforms given variable's value if the option is parsed and exist. Returns the initial value otherwise.
	 *
	 * @param {string} variableValue - variable's value
	 * @param {string} variableOption - given option
	 * @param {object} argOptions
	 * @returns {string}
	 */
	private replaceOne(variable: Record<"name" | "value", string>, variableOption: string, argSeparator: string): string {
		const parsed = Option.parse(variableOption, argSeparator);

		if (parsed) {
			const { option, args } = parsed;

			const foundOption = this.findVariableOption(variable.name, option) || this.findGlobalOption(option);

			if (!foundOption) return variable.value;

			const result = foundOption.apply(variable.value, args);

			return result;
		}
		return variable.value;
	}

	public addGlobalOption<Args extends Arg[]>(option: Option<Args>) {
		const isExist = this.isOptionAlreadyExist(option.name);

		if (!isExist) {
			this.options.push(option);
		}
	}

	public addLocalOption<Args extends Arg[]>(option: Option<Args>, variableName: Variables) {
		const foundVariable = this.findVariable(variableName);

		if (foundVariable) foundVariable.addOption(option);
	}

	public addVariable(variable: IVariableObject<Variables>) {
		const isExist = this.isVariableAlreadyExist(variable.name);

		if (!isExist) {
			this.variables.push(new Variable(variable.name, variable.value));
		}
	}

	/**
	 * Replaces added variables and transform their values using all allowed options
	 *
	 * For example:
	 *
	 * 		FILENAME = "application.js"
	 *
	 * 		this.render("$[FILENAME]") -> "application.js"
	 * 		this.render("$[FILENAME:WITHOUT_EXT]") -> "application"
	 * 		this.render("$[FILENAME:ONLY_EXT]") -> "js"
	 * @param {string} text - source text with the variables and their options
	 * @param {Object} templateOptions - template options. See more: https://github.com/ThatsEmbarrassing/text-replace/blob/release/github-assets/en/README.en.md#template-options
	 * @returns {string}
	 */
	public render(text: string, templateOptions: Partial<TemplateOptions>): string {
		const { argSeparator = "; " } = templateOptions;

		return render({
			text,
			templateOptions,
			renderCallback: (sourceText, sourceMatch, variable, options) => {
				const foundVariable = this.findVariable(variable);

				if (!foundVariable) return text;

				const reduced = options.reduce((currentValue, currentOption) => {
					const result = this.replaceOne({ name: variable, value: currentValue }, currentOption, argSeparator);

					return result;
				}, foundVariable.getValue());

				const replaced = sourceText.replace(sourceMatch, reduced);

				return replaced;
			},
		});
	}
}
