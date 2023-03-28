import { Arg } from "@/helpers";
import { BaseOptionError, BaseOptionErrorConstructor } from "./BaseOptionError";

export interface ApplyOptionErrorConstructor extends Omit<BaseOptionErrorConstructor, "name"> {
	value: string;
	args?: Arg[];
}

export class ApplyOptionError extends BaseOptionError {
	value: string;
	args?: Arg[];

	constructor({ optionName, value, args, errorMessage }: ApplyOptionErrorConstructor) {
		super({ name: "APPLY_OPTION_ERROR", optionName, errorMessage });

		this.value = value;
		this.args = args;
	}
}
