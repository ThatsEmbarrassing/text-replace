import { Configure } from "@/Configure";
import { FILENAME, OPTION__2, RANGE, REPEAT, UPPER, VAR } from "../test-assets";

describe("Options", () => {
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

	test("option's combinations", () => {
		const replace = Configure({
			globalOptions: [UPPER, RANGE, REPEAT],
			variables: [FILENAME, VAR],
		});

		const text = "$[FILENAME:WITHOUT_EXT:UPPER] $[VAR:RANGE(; 3):REPEAT(2; |)]";

		const result = "APPLICATION var|var";

		expect(replace(text)).toBe(result);
	});
});
