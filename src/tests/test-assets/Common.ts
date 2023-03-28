import { BaseErrorConstructor, BaseError } from "@errors/custom";
import { ErrorHandler } from "@errors/hanlders";

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

export class ArgumentsIsMissingErrorHandler implements ErrorHandler {
	handle(): string {
		return `ArgumentsIsMissingError: Arguments is missing in REPEAT option`;
	}
}

export class TimesParameterIsMissingErrorHandler implements ErrorHandler {
	handle(): string {
		return `TimesParameterIsMissingError: Times parameter is missing in REPEAT option`;
	}
}
