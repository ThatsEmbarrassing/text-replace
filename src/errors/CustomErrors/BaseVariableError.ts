import { BaseError, BaseErrorConstructor } from "@/errors";

export type VariableErrorName = "GET_VALUE_ERROR";

export interface BaseVariableErrorConstructor extends BaseErrorConstructor<VariableErrorName> {
	variableName: string;
	variableValue?: string;
}

export class BaseVariableError extends BaseError<VariableErrorName> {
	variableName: string;
	variableValue?: string;

	constructor({ name, variableName, errorMessage, variableValue }: BaseVariableErrorConstructor) {
		super({ name, errorMessage });

		this.variableName = variableName;
		this.variableValue = variableValue;
	}
}
