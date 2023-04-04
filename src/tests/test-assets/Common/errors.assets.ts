import { BaseError, BaseErrorConstructor } from "@/errors/CustomErrors";

export type RepeatOptionErrorName = "ARGUMENTS_IS_MISSING" | "TIMES_PARAMETER_IS_MISSING";

type BaseRepeatOptionErrorConstructor = BaseErrorConstructor<RepeatOptionErrorName>;

type ArgumentsIsMissingErrorConstructor = Omit<BaseRepeatOptionErrorConstructor, "name">;

type TimesParameterIsMissingErrorConstructor = ArgumentsIsMissingErrorConstructor;

class BaseRepeatOptionError extends BaseError<RepeatOptionErrorName> {
	constructor(options: BaseRepeatOptionErrorConstructor) {
		super(options);
	}
}

export class ArgumentsIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }: ArgumentsIsMissingErrorConstructor) {
		super({ name: "ARGUMENTS_IS_MISSING", errorMessage });
	}
}

export class TimesParameterIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }: TimesParameterIsMissingErrorConstructor) {
		super({ name: "TIMES_PARAMETER_IS_MISSING", errorMessage });
	}
}
