import { AbstractArgumentsHandler } from "./AbstractArgumentsHandler";

export class UndefinedArgumentsHandler extends AbstractArgumentsHandler {
	parseArg(arg: string | undefined): unknown | undefined {
		return !arg || arg === " " ? undefined : super.parseArg(arg);
	}
}
