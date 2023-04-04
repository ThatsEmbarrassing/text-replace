import { AbstractArgumentsHandler } from "./AbstractArgumentsHandler";

export class NumberArgumentsHandler extends AbstractArgumentsHandler {
	parseArg(arg: string): number | unknown {
		return Number.isNaN(Number(arg)) ? super.parseArg(arg) : Number(arg);
	}
}
