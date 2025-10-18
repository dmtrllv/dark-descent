import { Vec2 } from "./vec";

export class Polygon {
	public static readonly offset = (polygon: Polygon, offset: Vec2) => {
		return new Polygon(...polygon.points.map(p => new Vec2(p.x + offset.x, p.y + offset.y)));
	}

	public readonly points: Vec2[];

	public constructor(...points: Vec2[]) {
		this.points = points;
	}

	public readonly add = (point: Vec2, index: number = this.points.length) => {
		if (index > this.points.length) {
			index = this.points.length;
		} else if (index < 0) {
			index = 0;
		}
		this.points.splice(index, 0, point);
	}

	public readonly remove = (point: Vec2) => {
		const index = this.points.findIndex(p => p.eq(point));
		if (index > -1) {
			this.points.splice(index, 1);
		}
	}

	public get segments(): Segment[] {
		const segments: Segment[] = [];
		for (let i = 0; i < this.points.length - 1; i++) {
			segments.push([this.points[i], this.points[i + 1]]);
		}
		segments.push([this.points[this.points.length - 1], this.points[0]]);
		return segments;
	}
}

type Segment = [Vec2, Vec2];