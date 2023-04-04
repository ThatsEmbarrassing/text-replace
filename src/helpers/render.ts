import { betweenMany } from "./betweenMany";
import { stringSlice } from "./stringSlice";
import { TemplateOptions } from "./types";

type IRenderCallback = (text: string, sourceMatch: string, variable: string, options: string[]) => string;

interface RenderOptions {
	/**
	 * Source text
	 */
	text: string;
	/**
	 * Template options
	 */
	templateOptions: Partial<TemplateOptions>;
	/**
	 * Render callback is called for every found option. Returns modified string
	 *
	 * @param text
	 * @param sourceMatch - the found match
	 * @param variable - variable's name
	 * @param options - variable's options in the text
	 */
	renderCallback: IRenderCallback;
}

/**
 *
 * @param renderOptions
 */
export function render(renderOptions: RenderOptions): string {
	const { renderCallback, templateOptions, text } = renderOptions;

	const { begin = "[", end = "]", prefix = "$", suffix = "", optionSeparator = ":" } = templateOptions;

	const left = prefix + begin;
	const right = end + suffix;

	const matches = betweenMany(text, left, right);

	return matches.reduce((modified, currentMatch) => {
		const [variable, ...options] = stringSlice(currentMatch, left.length, -right.length).split(optionSeparator);

		return renderCallback(modified, currentMatch, variable, options);
	}, text);
}
