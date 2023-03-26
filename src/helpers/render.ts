import { getTemplateString } from "./getTemplateString";
import { TemplateOptions } from "./types";

type IRenderCallback = (currentValue: string, valueOption: string) => string;

interface RenderOptions {
	text: string;
	variableName: string;
	variableValue: string;
	options: Partial<TemplateOptions>;
	renderCallback: IRenderCallback;
}

export function render(renderOptions: RenderOptions) {
	const { options, renderCallback, text, variableName, variableValue } = renderOptions;

	const templateString = getTemplateString(variableName, options);
	const regex = new RegExp(templateString, "g");

	const { optionSeparator = ":" } = options;

	return text.replace(regex, (_, options: string) => {
		const variableOptions = options ? options.split(optionSeparator) : [];

		return variableOptions.reduce(renderCallback, variableValue);
	});
}
