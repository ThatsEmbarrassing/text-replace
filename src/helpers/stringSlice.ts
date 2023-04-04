export function stringSlice(string: string, start: number, end: number) {
	return string.split("").slice(start, end).join("");
}
