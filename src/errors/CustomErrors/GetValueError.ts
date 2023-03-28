import { BaseVariableError, BaseVariableErrorConstructor } from "./BaseVariableError";

export type GetValueErrorConstructor = Omit<BaseVariableErrorConstructor, "name">;

export class GetValueError extends BaseVariableError {
	constructor({ variableName, errorMessage, variableValue }: GetValueErrorConstructor) {
		super({ name: "GET_VALUE_ERROR", errorMessage, variableName, variableValue });
	}
}
