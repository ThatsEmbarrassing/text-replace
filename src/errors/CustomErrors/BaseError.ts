export interface BaseErrorConstructor<T extends string> {
	name: T;
	errorMessage?: string;
}

export class BaseError<T extends string> extends Error {
	name: T;
	errorMessage?: string;
	constructor({ name, errorMessage }: BaseErrorConstructor<T>) {
		super();

		this.name = name;
		this.errorMessage = errorMessage;
	}
}
