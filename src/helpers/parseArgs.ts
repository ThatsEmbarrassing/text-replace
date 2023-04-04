import { AbstractArgumentsHandler } from "@/lib/Option/lib/AbstractArgumentsHandler";
import { InitialArgumentsHandler } from "@/lib/Option/lib/InitialArgumentsHandler";
import { Arg } from "./types";

/**
 *
 * @param argSeparator - arguments separator
 * @param args - matched option's arguments in ()
 */
export function parseArgs(handler: AbstractArgumentsHandler, argSeparator: string, args?: string): Arg[] {
	if (args !== undefined) {
		return args.split(argSeparator).map((arg) => {
			if (handler instanceof InitialArgumentsHandler) handler.setArgSeparator(argSeparator);
			return handler.parseArg(arg) as string;
		});
	}
	return [];
}
