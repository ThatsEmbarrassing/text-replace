/**
 * Returns object from where parameter if there is a property with what parameter value, undefined otherwise.
 *
 * @param where - entry object's array
 * @param what - value that you need to find in where parameter
 */
export function find<O extends object, K extends O[keyof O]>(where: O[], what: K): O | undefined {
	return where.find((obj) => {
		return Object.values(obj).includes(what);
	});
}
