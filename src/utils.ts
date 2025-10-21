export const isPowerOf2 = (x: number) => (x & (x - 1)) === 0;

export const clamp = (n: number, min: number, max: number) => n > max ? max : n < min ? min : n;