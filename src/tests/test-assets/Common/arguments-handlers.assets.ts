import { AbstractArgumentsHandler } from "@/lib";

export class JSONArgumentsHandler extends AbstractArgumentsHandler {
	parseArg(arg: string): unknown[] | unknown {
		try {
			return JSON.parse(arg);
		} catch {
			return super.parseArg(arg);
		}
	}
}
