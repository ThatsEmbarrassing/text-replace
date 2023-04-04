import { ApplyOptionError } from "@errors/custom";
import { ConfigureOption } from "@/Configure";
import { ArgumentsIsMissingError, TimesParameterIsMissingError } from "./Common/errors.assets";

export const WITHOUT_EXT: ConfigureOption = { name: "WITHOUT_EXT", transform: (value) => value.split(".")[0] };
export const ONLY_EXT: ConfigureOption = { name: "ONLY_EXT", transform: (value) => value.split(".")[1] };

export const OPTION__1: ConfigureOption = { name: "OPTION", transform: () => "first" };
export const OPTION__2: ConfigureOption = { name: "OPTION", transform: () => "second" };

export const UPPER: ConfigureOption = { name: "UPPER", transform: (value) => value.toUpperCase() };

export const SPECIAL_OPTION_WITH_THREE_PARAMS: ConfigureOption<[number | undefined, number | undefined, number]> = {
	name: "SPEC_OPTION",
	transform: (value, args) => {
		if (args.length === 0)
			throw new ApplyOptionError({
				optionName: "SPEC_OPTION",
				value,
				args,
			});

		const [first = 2, second = 5, third] = args;

		return `first_${first}__second_${second}__third_${third}`;
	},
};
export const RANGE: ConfigureOption<[number, number]> = {
	name: "RANGE",
	transform: (value, range) => {
		if (!range) return value;
		const [start = 0, end = value.length] = range;

		return value.slice(start, end);
	},
};

export const REPEAT: ConfigureOption<[number | undefined, string]> = {
	name: "REPEAT",
	transform: (value, args) => {
		if (args.length === 0) throw new ArgumentsIsMissingError({});
		const [times, separator = ""] = args;
		if (!times) throw new TimesParameterIsMissingError({});

		return new Array(times).fill(value).join(separator);
	},
};

function coefOperation(value: string, args: [number[]] | [], _operation: (num: number, coef: number) => number) {
	const coef = Number(value);

	if (args.length === 0) return JSON.stringify([]);

	const [nums] = args;

	return JSON.stringify(nums.map((num) => _operation(num, coef)));
}

export const SUM: ConfigureOption<[number[]]> = {
	name: "SUM",
	transform: (value, args) => {
		return coefOperation(value, args, (num, coef) => num + coef);
	},
};

export const MINUS: ConfigureOption<[number[]]> = {
	name: "MINUS",
	transform: (value, args) => {
		return coefOperation(value, args, (num, coef) => num - coef);
	},
};

