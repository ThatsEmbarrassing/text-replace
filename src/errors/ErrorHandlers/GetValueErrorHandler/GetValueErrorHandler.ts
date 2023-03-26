import { GetValueError } from "../../CustomErrors";
import { ErrorHandler } from "../ErrorHandle/ErrorHandle";

export class GetValueErrorHandler implements ErrorHandler {
	handle(err: GetValueError): string {
		return `GetValueError: Getting ${err.variableName} variable's value caused an error. Additional message: ${
			err.errorMessage || "none"
		}`;
	}
}
