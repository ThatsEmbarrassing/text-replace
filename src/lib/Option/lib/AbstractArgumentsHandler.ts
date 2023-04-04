import { ArgumentsHandler } from "./types/ArgumentsHandler";

export abstract class AbstractArgumentsHandler implements ArgumentsHandler {
	next!: ArgumentsHandler;

	setNext(handler: ArgumentsHandler): ArgumentsHandler {
		this.next = handler;

		return handler;
	}

	parseArg(arg: unknown): unknown {
		if (this.next) {
			return this.next.parseArg(arg);
		}
		return false;
	}
}
