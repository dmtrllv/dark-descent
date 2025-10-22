import { Vec2 } from "../vec";
import { BoxCollider } from "./box-collider";
import { Collider } from "./collider";

export class LineCollider extends Collider {
	get top(): number {
		return Math.max(this.start.y, this.end.y);
	}

	get bottom(): number {
		return Math.min(this.start.y, this.end.y);
	}

	public collidesWith(col: Collider): boolean {
		const sx = this.transform.position.x + this.start.x;
		const ex = this.transform.position.x + this.end.x;
		const sy = this.transform.position.y + this.start.y;
		const ey = this.transform.position.y + this.end.y;

		if (col instanceof LineCollider) {
			const csx = col.transform.position.x + col.start.x;
			const cex = col.transform.position.x + col.end.x;
			const csy = col.transform.position.y + col.start.y;
			const cey = col.transform.position.y + col.end.y;
			if(csx < sx && csx < ex)
				return false;
			if(csx > sx && csx > ex)
				return false;

			if(cex < sx && cex < ex)
				return false;
			if(cex > sx && cex > ex)
				return false;
			
			if(csy < sy && csy < ey)
				return false;
			if(csy > sy && csy > ey)
				return false;
			
			if(cey < sy && cey < ey)
				return false;
			if(cey > sy && cey > ey)
				return false;
			
			return true;
		} else if (col instanceof BoxCollider) {
			const cxl = col.transform.position.x - col.size.x;
			const cxr = col.transform.position.x + col.size.x;
			const cyt = col.transform.position.y - col.size.y;
			const cyb = col.transform.position.y + col.size.y;
			if (cxl > sx && cxl > ex)
				return false;
			if (cxr < sx && cxr < ex)
				return false;
			if (cyt > sy && cyt > ey)
				return false;
			if (cyb < sy && cyb < ey)
				return false;
			return true;
		}

		throw new Error("TODO!");
	}

	public start: Vec2 = new Vec2();
	public end: Vec2 = new Vec2();
}