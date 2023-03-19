import { find } from "./find";

export function isAlreadyExist<O extends object, K extends O[keyof O]>(where: O[], what: K): boolean {
	const found = find(where, what);

	return !!found;
}
