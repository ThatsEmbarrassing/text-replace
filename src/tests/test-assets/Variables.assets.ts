import { ConfigureVariable } from "@/Configure";
import { MINUS, ONLY_EXT, OPTION__1, SUM, WITHOUT_EXT } from "./Options.assets";

export const FILENAME: ConfigureVariable = {
	name: "FILENAME",
	value: "application.js",
	options: [WITHOUT_EXT, ONLY_EXT],
};

export const VAR: ConfigureVariable = {
	name: "VAR",
	value: "var_var_var_var",
	options: [OPTION__1],
};

export const COEFFICIENT: ConfigureVariable = {
	name: "COEFFICIENT",
	value: "1.5",
	options: [SUM, MINUS],
};
