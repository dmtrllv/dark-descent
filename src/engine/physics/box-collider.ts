import { Vec2 } from "../vec";
import { Collider } from "./collider";
import { LineCollider } from "./line-collider";

export class BoxCollider extends Collider {
	get top(): number {
		return this.transform.position.y + this.size.x;
	}
	
	get bottom(): number {
		return this.transform.position.y - this.size.x;
	}

	public size: Vec2 = new Vec2(1, 1);

	public collidesWith(c: Collider): boolean {
		const xl = this.transform.position.x - this.size.x;
		const xr = this.transform.position.x + this.size.x;

		const yt = this.transform.position.y - this.size.y;
		const yb = this.transform.position.y + this.size.y;

		if (c instanceof LineCollider) {
			const b1x = c.start.x;
			const b2x = c.end.x;
			const b1y = c.start.y;
			const b2y = c.end.y;
			if (b1x > xr && b2x > xr)
				return false;
			if (b1x < xl && b2x < xl)
				return false;
			if (b1y > yt && b2y > yt)
				return false;
			if (b1y < yb && b2y < yb)
				return false;
			return true;
		} else if (c instanceof BoxCollider) {
			const cxl = c.transform.position.x - c.size.x;
			const cxr = c.transform.position.x + c.size.x;
			const cyt = c.transform.position.y - c.size.y;
			const cyb = c.transform.position.y + c.size.y;
			if (cxl > xr)
				return false;
			if (cxr < xl)
				return false;
			if (cyt > yb)
				return false;
			if (cyb > yt)
				return false;
			return true;
		}

		throw new Error("TODO!");
	}
}