import { BaseError, BaseErrorConstructor } from "@/errors";

export type OptionErrorName = "APPLY_OPTION_ERROR";

export interface BaseOptionErrorConstructor extends BaseErrorConstructor<OptionErrorName> {
	optionName: string;
}

export class BaseOptionError extends BaseError<OptionErrorName> {
	errorName: OptionErrorName;
	optionName: string;
	errorMessage?: string;
	constructor({ name, optionName, errorMessage }: BaseOptionErrorConstructor) {
		super({ errorMessage, name });

		this.optionName = optionName;
	}
}
