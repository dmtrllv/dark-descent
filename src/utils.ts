export const isPowerOf2 = (x: number) => (x & (x - 1)) === 0;

export const clamp = (n: number, min: number, max: number) => n > max ? max : n < min ? min : n;

export const split = <T>(arr: T[], left: (item: T) => boolean): [T[], T[]] => {
	const splitted: [T[], T[]] = [[], []];

	arr.forEach(item => {
		const index = 1 - (+left(item));
		splitted[index].push(item);
	})

	return splitted;
}

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);