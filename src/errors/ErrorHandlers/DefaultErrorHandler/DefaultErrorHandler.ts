import { BaseError } from "../../CustomErrors/BaseError";
import { ErrorHandler } from "../ErrorHandle/ErrorHandle";

export class DefaultErrorHandler implements ErrorHandler {
	handle(err: BaseError<string>): string {
		return `UnknownError: ${err.name || "Error"} with message "${err.errorMessage || "none"}".`;
	}
}
