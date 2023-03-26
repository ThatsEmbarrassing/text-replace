import { Configure, ConfigureVariable } from "@/Configure";
import { ApplyOptionError, Option } from "@/lib";

describe("Template engine", () => {


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

	test("options with parameters", () => {
		const replace = Configure({
			globalOptions: [RANGE, REPEAT, UPPER],
			variables: [FILENAME],
		});

		const text1 = "$[FILENAME:RANGE(0, 3)]";

		expect(replace(text1)).toBe("app");
	});

	test("options with optional parameters", () => {
		const replace = Configure({
			globalOptions: [RANGE, REPEAT, SPECIAL_OPTION_WITH_THREE_PARAMS],
			variables: [FILENAME],
		});

		const text1 = "$[FILENAME:WITHOUT_EXT:RANGE(0, )]";
		const text2 = "$[FILENAME:RANGE(12)]";
		const text3 = "$[FILENAME:WITHOUT_EXT:RANGE(, 11)]";
		const text4 = "$[FILENAME:WITHOUT_EXT:RANGE]";
		const text5 = "$[FILENAME:ONLY_EXT:REPEAT(3, |)]";
		const text6 = "$[FILENAME:ONLY_EXT:REPEAT(5, )]";
		const text7 = "$[FILENAME:ONLY_EXT:REPEAT(5)]";
		const text8 = "$[FILENAME:SPEC_OPTION(1, , 5)]";
		const text9 = "$[FILENAME:SPEC_OPTION(, , 10)]";
		const text10 = "$[FILENAME:ONLY_EXT:REPEAT(, |)]";
		const text11 = "$[FILENAME:SPEC_OPTION]";

		expect(replace(text1)).toBe("application");
		expect(replace(text2)).toBe("js");
		expect(replace(text3)).toBe("application");
		expect(replace(text4)).toBe("application");
		expect(replace(text5)).toBe("js|js|js");
		expect(replace(text6)).toBe("jsjsjsjsjs");
		expect(replace(text7)).toBe("jsjsjsjsjs");
		expect(replace(text8)).toBe("first_1__second_5__third_5");
		expect(replace(text9)).toBe("first_2__second_5__third_10");

		expect(() => replace(text10)).toThrow(Error);
		// prettier-ignore
		expect(() => replace(text10)).toThrow("UnknownError: Error with message \"Times parameter is missing\".");

		expect(() => replace(text11)).toThrow();
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
