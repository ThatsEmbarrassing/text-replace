import { Configure } from "@/Configure";
import { ErrorHandle } from "@errors/handlers";
import {
	ArgumentsIsMissingErrorHandler,
	FILENAME,
	REPEAT,
	TimesParameterIsMissingErrorHandler,
	UPPER,
} from "../test-assets";

describe("Configure", () => {
	test("template options", () => {
		const replace = Configure({
			globalOptions: [UPPER],
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

	test("handling custom errors", () => {
		const errorHandle = new ErrorHandle();

		errorHandle.use("ARGUMENTS_IS_MISSING", new ArgumentsIsMissingErrorHandler());
		errorHandle.use("TIMES_PARAMETER_IS_MISSING", new TimesParameterIsMissingErrorHandler());

		const replace = Configure({
			globalOptions: [REPEAT],
			variables: [FILENAME],
			errorHandle,
		});

		const text1 = "$[FILENAME:WITHOUT_EXT:REPEAT(, |)]";
		const text2 = "$[FILENAME:WITHOUT_EXT:REPEAT]";

		expect(() => replace(text1)).toThrow("TimesParameterIsMissingError: Times parameter is missing in REPEAT option");
		expect(() => replace(text2)).toThrow("ArgumentsIsMissingError: Arguments is missing in REPEAT option");
	});
});
