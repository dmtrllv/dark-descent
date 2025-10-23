import { GameObject, Transform, Vec2, SpriteRenderer, Light, Component } from "../../engine";
import { layers } from "../layers";

import * as sprites from "../sprites";

export class Moon extends GameObject {
	public constructor(camera: Transform, position: Vec2 = new Vec2()) {
		super();
		this.transform.position = position;
		this.addComponent(SpriteRenderer, {
			sprite: sprites.moon.get(),
			layer: layers.background.get(),
		});
		this.addComponent(Light, {
			radius: 5,
			targetLayers: [
				layers.background.get()
			]
		});
		this.addComponent(CamFollower, { camera });
	}
}

class CamFollower extends Component {
	public camera: Transform | null = null;

	public onUpdate(): void {
		if (this.camera) {
			this.transform.position.x = (this.camera.position.x - 3) / 3;
			this.transform.position.y = (this.camera.position.y + 20) / 3;
		}
	}
}