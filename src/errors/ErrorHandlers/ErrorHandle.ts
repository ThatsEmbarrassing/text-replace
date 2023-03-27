export interface ErrorHandler {
	handle(err: Error): string;
}

export class ErrorHandle {
	private handlers: Record<string | "default", ErrorHandler>;

	public use<K extends ErrorHandler>(name: string, err: K): void {
		this.handlers = {
			...this.handlers,
			[name]: err,
		};
	}

	public handle<T extends Error>(name: string, err: T): never {
		const handler = this.handlers[name] || this.handlers["default"];

		throw new Error(handler.handle(err));
	}
}
