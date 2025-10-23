export class Vec2 {
	public static readonly distance = (a: Vec2, b: Vec2) => {
		const x = a.x - b.x;
		const y = a.y - b.y;
		return Math.sqrt((x ** 2) + (y ** 2));
	}

	public static readonly scale = (v: Vec2, s: number): Vec2 => {
		return new Vec2(v.x * s, v.y * s);
	}

	public static readonly add = (a: Vec2, b: Vec2): Vec2 => {
		return new Vec2(a.x + b.x, a.y + b.y);
	}

	public static readonly sub = (a: Vec2, b: Vec2): Vec2 => {
		return new Vec2(a.x - b.x, a.y - b.y);
	}

	private readonly _data = new Float32Array([0, 0]);

	public get farray(): Readonly<Float32Array> { return this._data; }
	public get array(): [number, number] { return [this.x, this.y]; }

	public get x(): number { return this._data[0]; }
	public get y(): number { return this._data[1]; }

	public set x(value: number) { this._data[0] = value; }
	public set y(value: number) { this._data[1] = value; }

	public get length() { return Math.sqrt(this.x ** 2 + this.y ** 2); }

	public get normalized() {
		const l = this.length;
		if (l === 0) {
			return new Vec2();
		}
		return new Vec2(this.x /= l, this.y /= l);
	}

	public constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public readonly eq = (other: Vec2) => {
		return this.x === other.x && this.y === other.y;
	}

	public add({ x, y }: Vec2): Vec2 {
		this.x += x;
		this.y += y;
		return this;
	}

	public sub({ x, y }: Vec2): Vec2 {
		this.x -= x;
		this.y -= y;
		return this;
	}

	public mul({ x, y }: Vec2): Vec2 {
		this.x *= x;
		this.y *= y;
		return this;
	}

	public div({ x, y }: Vec2): Vec2 {
		this.x = x === 0 ? 0 : this.x / x;
		this.y = y === 0 ? 0 : this.y / y;
		return this;
	}

	public normalize(): Vec2 {
		const l = this.length;
		if (l === 0) {
			this.x = 0;
			this.y = 0;
		} else {
			this.x /= l;
			this.y /= l;
		}
		return this;
	}

	public scale(scalar: number): Vec2 {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	public readonly round = (scale: number) => {
		this.x = Math.round(this.x * scale) / scale;
		this.y = Math.round(this.y * scale) / scale;
		return this;
	}

	public readonly clone = (): any => new Vec2(this.x, this.y);

}

//export const vec2 = (x: number = 0, y: number = 0) => new Vec2(x, y);