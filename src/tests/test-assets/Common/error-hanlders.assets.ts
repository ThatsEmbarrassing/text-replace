import { ErrorHandler } from "@/errors/ErrorHandlers/ErrorHandle";

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
