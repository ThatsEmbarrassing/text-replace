import { Arg } from "@/helpers/types";

export class ApplyOptionError<Args extends Arg[]> extends Error {
	public readonly optionName: string;
	public readonly applyValue: string;
	public readonly args: Args | undefined;
	public readonly additionMessage?: string;

	constructor(optionName: string, applyValue: string, args?: Args, message?: string) {
		const baseMessage = `During the execution of the "apply" method, error occured. Value: ${applyValue}, args: ${
			args ? args.toString() : ""
		}. `;
		const errorMessage = message ? baseMessage + `Additional message: ${message}` : message;

		super(errorMessage);

		this.optionName = optionName;
		this.applyValue = applyValue;
		this.args = args;
		this.additionMessage = message;
	}
}
