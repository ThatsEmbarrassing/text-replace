export function between(str: string, left: string, right: string) {
	const leftIndex = str.indexOf(left);
	const rightIndex = str.indexOf(right);

	if (leftIndex === -1 || rightIndex === -1) {
		return "";
	}

	return {
		string: str.slice(leftIndex, rightIndex + right.length),
		leftIndex,
		rightIndex,
	};
}
