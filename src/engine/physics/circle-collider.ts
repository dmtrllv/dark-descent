//import { BoxCollider } from "./box-collider";
//import { Collider } from "./collider";
//import { PathCollider } from "./path-collider";

//export class CircleCollider extends Collider {
//	public collidesWith(col: Collider): boolean {
//		switch (col.constructor.name) {
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

//}