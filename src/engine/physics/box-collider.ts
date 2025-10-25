import { Component } from "../component";
import { Vec2 } from "../vec";

export class BoxCollider extends Component {
	public enabled: boolean = false;
	public _size: Vec2 = new Vec2(1, 1);
	public _offset: Vec2 = new Vec2();
	private _isDirty: boolean = false;

	public get size(): Readonly<Vec2> { return this._size; }
	public get offset(): Readonly<Vec2> { return this._offset; }

	public set size(value: Vec2) {
		this._size = value;
		this._isDirty = true;
	}

	public set offset(value: Vec2) {
		this._offset = value;
		this._isDirty = true;
	}

	private _left: number = 0;
	private _right: number = 0;
	private _top: number = 0;
	private _bottom: number = 0;

	public get left(): number { return this._left; }
	public get right(): number { return this._right; }
	public get top(): number { return this._top; }
	public get bottom(): number { return this._bottom; }

	public get center() {
		return Vec2.add(this.transform.position, this.offset);
	}

	public onStart(): void {
		this.recalc();
	}

	public collidesWith(col: BoxCollider): boolean {
		const withinX = col.right > this.left && col.left < this.right;
		const withinY = col.top > this.bottom && col.bottom < this.top;
		return withinX && withinY;
	}

	private recalc() {
		this._isDirty = false;
		const { x, y } = this.center;
		this._left = x - this.size.x / 2;
		this._right = x + this.size.x / 2;
		this._top = y + this.size.y / 2;
		this._bottom = y - this.size.y / 2;
	}

	public updateDirty(): void {
		if (this._isDirty || this.transform.isDirty) {
			this.recalc();
		}
	}
}