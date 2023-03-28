import { ApplyOptionError } from "@errors/custom";
import { Option } from "@/lib";
import { ArgumentsIsMissingError, TimesParameterIsMissingError } from "./Common";

export const WITHOUT_EXT = new Option("WITHOUT_EXT", (value) => value.split(".")[0]);
export const ONLY_EXT = new Option("ONLY_EXT", (value) => value.split(".")[1]);

export const OPTION__1 = new Option("OPTION", () => "first");
export const OPTION__2 = new Option("OPTION", () => "second");

export const UPPER = new Option("UPPER", (value) => value.toUpperCase());

export const SPECIAL_OPTION_WITH_THREE_PARAMS = new Option<[number | undefined, number | undefined, number]>(
	"SPEC_OPTION",
	(value, args) => {
		if (!args)
			throw new ApplyOptionError({
				optionName: "SPEC_OPTION",
				value,
				args,
			});

		const [first = 2, second = 5, third] = args;

		return `first_${first}__second_${second}__third_${third}`;
	},
);

export const RANGE = new Option<[number, number]>("RANGE", (value, range) => {
	if (!range) return value;
	const [start = 0, end = value.length] = range;

	return value.slice(start, end);
});

export const REPEAT = new Option<[number | undefined, string | undefined]>("REPEAT", (value, args) => {
	if (!args) throw new ArgumentsIsMissingError({});
	const [times, separator = ""] = args;
	if (!times) throw new TimesParameterIsMissingError({});

	return new Array(times).fill(value).join(separator);
});
