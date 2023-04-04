import { between } from "./between";

export function betweenMany(str: string, left: string, right: string) {
	let text = str;
	const matches: string[] = [];

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const match = between(text, left, right);

		if (match === "") break;

		matches.push(match.string);

		text = text.slice(match.rightIndex + right.length);
	}

	return matches;
}
