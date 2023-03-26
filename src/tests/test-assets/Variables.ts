import { ConfigureVariable } from "@/Configure";
import { ONLY_EXT, OPTION__1, WITHOUT_EXT } from "./Options";

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
