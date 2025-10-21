export class Color {
	private readonly _data = new Float32Array([0, 0, 0, 1.0]);

	public get array(): Readonly<Float32Array> { return this._data; }

	public get r(): number { return this._data[0]; }
	public get g(): number { return this._data[1]; }
	public get b(): number { return this._data[2]; }
	public get a(): number { return this._data[3]; }

	public set r(value: number) { this._data[0] = value; }
	public set g(value: number) { this._data[1] = value; }
	public set b(value: number) { this._data[2] = value; }
	public set a(value: number) { this._data[3] = value; }

	public constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}