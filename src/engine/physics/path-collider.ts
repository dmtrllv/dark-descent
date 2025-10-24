//import { Vec2 } from "../vec";
//import { BoxCollider } from "./box-collider";
//import { CircleCollider } from "./circle-collider";
//import { Collider } from "./collider";

//export class PathCollider extends Collider {
//	private _isDirty: boolean = false;

//	public get isDirty(): boolean {
//		return this._isDirty || this.transform.isDirty;
//	}

//	private _points: Vec2[] = [
//		new Vec2(-1, 0),
//		new Vec2(1, 0)
//	];

//	private _worldPoints: Vec2[] = [];

//	public get points(): readonly Readonly<Vec2>[] {
//		return this._points;
//	}

//	public set points(value: Vec2[]) {
//		this._points = value;
//		this._isDirty = true;
//	}

//	public collidesWith(col: Collider): boolean {
//		switch(col.constructor.name) {
//			case BoxCollider.name: return this.collidesWithBox(col);
//			case CircleCollider.name: return this.collidesWithCircle(col);
//			case PathCollider.name: return this.collidesWithPath(col);
//		}
//		throw new Error(`Unknown collider type ${col.constructor.name}`);
//	}

//	private collidesWithPath(col: Collider): boolean {
//		return false;
//	}

//	private collidesWithBox(col: Collider): boolean {
//		return false;
//	}
	
//	private collidesWithCircle(col: Collider): boolean {
//		return false;
//	}

//	private recalcWorldPoints(): Vec2[] {
//		return this._points.map(p => Vec2.add(p, this.transform.position));
//	}

//	public onStart(): void {
//		this._worldPoints = this.recalcWorldPoints();
//	}

//	public onUpdate(): void {
//		if (this.isDirty) {
//			this._worldPoints = this.recalcWorldPoints();
//			this._isDirty = false;
//		}
//	}
//}