import { Component } from "../component";
import { Polygon } from "../polygon";
import { Vec2 } from "../vec";

export class ShadowCaster extends Component {
	public selfShadow: boolean = false;
	
	public caster: Polygon = new Polygon(
		new Vec2(-1, -1),
		new Vec2(-1, 1),
		new Vec2(1, 1),
		new Vec2(1, -1),
	);

	public get castingPolygon() {
		return Polygon.offset(this.caster, this.transform.position);
	}
}