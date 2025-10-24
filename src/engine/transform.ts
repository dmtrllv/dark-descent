import type { GameObject } from "./game-object";
import { Vec2 } from "./vec";

export class Transform {

	private _position: Vec2 = new Proxy(new Vec2(), {
		set: (target: any, k, v) => {
			target[k] = v;
			this._isDirty = true;
			return true
		}
	});

	private _parent: Transform | null = null;
	private _isDirty: boolean = false;

	public get isDirty() { return this._isDirty; }

	public get position() { return this._position; }
	public get parent() { return this._parent; }

	public set position(position: Vec2) {
		this._position.x = position.x;
		this._position.y = position.y;
	}

	public set parent(parent: Transform | null) {
		this._parent = parent;
		this._isDirty = true;
	}

	public readonly gameObject: GameObject;

	public constructor(gameObject: GameObject) {
		this.gameObject = gameObject;
	}

	//public resolveDirty(callback: () => void) {
	//	if (this._isDirty)
	//		callback();
	//	this._isDirty = false;
	//	return;
	//}
	
	public readonly resetDirty = (): void => {
		this._isDirty = false;
	}
}