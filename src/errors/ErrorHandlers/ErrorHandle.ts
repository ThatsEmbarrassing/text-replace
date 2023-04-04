export interface ErrorHandler {
	/**
	 * Handle an error
	 *
	 * @param err - thrown error that need to handle
	 */
	handle(err: Error): string;
}

export class ErrorHandle {
	private handlers: Record<string | "default", ErrorHandler>;

	/**
	 * Add new handler
	 *
	 * @param name - name of error
	 * @param handler - error handler
	 */
	public use<K extends ErrorHandler>(name: string, handler: K): void {
		this.handlers = {
			...this.handlers,
			[name]: handler,
		};
	}

	/**
	 * Handle a thrown error. If there is no handlers for this error, handle method of default error handler is called.
	 *
	 * @param error - thrown error
	 */
	public handle<T extends Error>(error: T): never {
		const handler = this.handlers[error.name] || this.handlers["default"];

		throw new Error(handler.handle(error));
	}
}
