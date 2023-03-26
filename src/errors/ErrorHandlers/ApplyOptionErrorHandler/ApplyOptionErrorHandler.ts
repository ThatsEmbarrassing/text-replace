import { ApplyOptionError } from "../../CustomErrors";
import { ErrorHandler } from "../ErrorHandle/ErrorHandle";

export class ApplyOptionErrorHandler implements ErrorHandler {
	handle(err: ApplyOptionError): string {
		return `ApplyOptionError: When using ${err.optionName}'s apply method with value '${err.value}' and args '${
			err.args?.join(", ") ?? "[]"
		}', the error occured. Additional message: "${err.errorMessage ?? "none"}"`;
	}
}
