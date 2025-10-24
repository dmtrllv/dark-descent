import { Component } from "../component";
import { Time } from "../time";
import { Vec2 } from "../vec";

export class Rigidbody extends Component {
	public gravity = new Vec2(0, -12);
	public velocity = new Vec2(0, 0);

	public onUpdate(): void {
		this.transform.position.add(Vec2.scale(this.velocity, Time.delta * 3));
		this.velocity.add(Vec2.scale(this.gravity, Time.delta));
	}
}