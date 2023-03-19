import { Configure, ConfigureVariable } from "./Configure";
import { Option } from "./models";

describe("Template engine", () => {
	const WITHOUT_EXT = new Option("WITHOUT_EXT", (value) => value.split(".")[0]);
	const ONLY_EXT = new Option("ONLY_EXT", (value) => value.split(".")[1]);

	const UPPER = new Option("UPPER", (value) => value.toUpperCase());

	const OPTION__1 = new Option("OPTION", () => "first");
	const OPTION__2 = new Option("OPTION", () => "second");

	const RANGE = new Option<[number, number]>("RANGE", (value, range) => {
		if (!range) return value;
		const [start = 0, end = value.length] = range;

		return value.slice(start, end);
	});

	const REPEAT = new Option<[number | undefined, string]>("REPEAT", (value, args) => {
		if (!args) throw new Error("Not enough arguments");
		const [times, separator = ""] = args;
		if (!times) throw new Error("Times parameter is missing");

		return new Array(times).fill(value).join(separator);
	});

	const FILENAME: ConfigureVariable = {
		name: "FILENAME",
		value: "application.js",
		options: [WITHOUT_EXT, ONLY_EXT],
	};

	const VAR: ConfigureVariable = {
		name: "VAR",
		value: "var_var_var_var",
		options: [OPTION__1],
	};

	test("without options", () => {
		const replace = Configure({
			globalOptions: [],
			variables: [FILENAME],
		});

		const text = "fooo $[FILENAME] fooo";

		expect(replace(text)).toBe("fooo application.js fooo");
	});

	test("with options", () => {
		const replace = Configure({
			globalOptions: [],
			variables: [FILENAME, VAR],
		});

		const text =
			"fooo $[FILENAME:WITHOUT_EXT]___$[FILENAME:ONLY_EXT] $[FILENAME:SOME_NOT_EXISTING_OPTION] $[VAR:ONLY_EXT]";

		expect(replace(text)).toBe("fooo application___js application.js var_var_var_var");
	});

	test("option's priority", () => {
		const replace = Configure({
			globalOptions: [OPTION__2],
			variables: [FILENAME, VAR],
		});

		const text = "foo $[FILENAME:OPTION] $[VAR:OPTION]";
		const result = replace(text);
		expect(result).toBe("foo second first");
	});

	test("options with parameters", () => {
		const replace = Configure({
			globalOptions: [RANGE],
			variables: [FILENAME],
		});

		const text1 = "$[FILENAME:RANGE(0, 3)]";
		const text2 = "$[FILENAME:RANGE(12)]";
		const text3 = "$[FILENAME:RANGE(, 11)]";
		const text4 = "$[FILENAME:RANGE]";

		expect(replace(text1)).toBe("app");
		expect(replace(text2)).toBe("js");
		expect(replace(text3)).toBe("application");
		expect(replace(text4)).toBe("application.js");
	});

	test("option's combinations", () => {
		const replace = Configure({
			globalOptions: [UPPER, RANGE, REPEAT],
			variables: [FILENAME, VAR],
		});

		const text = "$[FILENAME:WITHOUT_EXT:UPPER] $[VAR:RANGE(, 3):REPEAT(2, |)]";

		const result = "APPLICATION var|var";

		expect(replace(text)).toBe(result);
	});

	test("template options", () => {
		const replace = Configure({
			globalOptions: [UPPER, RANGE, REPEAT],
			variables: [FILENAME],
			templateOptions: {
				begin: "__",
				end: "__",
				prefix: "",
				optionSeparator: "|",
				argSeparator: ":",
				suffix: "\\!",
			},
		});

		const text = "__FILENAME|WITHOUT_EXT|UPPER__!";

		expect(replace(text)).toBe("APPLICATION");
	});
});
