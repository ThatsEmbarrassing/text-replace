import { find } from "./find";

/**
 * Returns true if there is object with given value, else false.
 *
 * @param where - entry object's array
 * @param what - value that you need to find in where parameter
 */
export function isAlreadyExist<O extends object, K extends O[keyof O]>(where: O[], what: K): boolean {
	const found = find(where, what);

	return !!found;
}
