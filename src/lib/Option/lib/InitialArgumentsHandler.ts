import { AbstractArgumentsHandler } from "./AbstractArgumentsHandler";

export class InitialArgumentsHandler extends AbstractArgumentsHandler {
	private argSeparator: string;

	public setArgSeparator(argSeparator: string) {
		this.argSeparator = argSeparator;
	}

	public parseArg(arg: string | undefined): unknown {
		const parsedArg = super.parseArg(arg);

		if (parsedArg || parsedArg === undefined) return parsedArg;

		if (typeof arg === "string") {
			const splitted = arg.split(this.argSeparator);

			if (splitted.length === 1) return arg;

			return splitted.map((splittedArg) => this.parseArg(splittedArg));
		}

		return undefined;
	}
}
