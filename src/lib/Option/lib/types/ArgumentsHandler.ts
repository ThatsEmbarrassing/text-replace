export interface ArgumentsHandler {
	next: ArgumentsHandler;

	setNext(handler: ArgumentsHandler): ArgumentsHandler;

	parseArg(arg: unknown): unknown;
}
