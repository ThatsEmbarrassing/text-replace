import { TemplateOptions } from "./types";

export function getTemplateString(variableName: string, options: Partial<TemplateOptions>) {
	const {
		prefix = "\\$",
		suffix = "",
		optionSeparator = ":",
		begin = "\\[",
		end = "\\]",
	} = options;

	const templateString = `${prefix}${begin}${variableName}(\\${optionSeparator}[^\\]]+)?${end}${suffix}`;

	return templateString;
}
