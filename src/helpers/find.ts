export function find<O extends object, K extends O[keyof O]>(where: O[], what: K): O | undefined {
	return where.find((obj) => {
		return Object.values(obj).includes(what);
	});
}
