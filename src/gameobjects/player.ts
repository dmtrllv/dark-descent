import { Component, GameObject, Layer, Light, SpriteRenderer, Vec2, AudioListener } from "../engine";
import { Time } from "../engine/time";

import * as sprites from "../sprites";

export class Player extends GameObject {
	public constructor() {
		super();

		this.addComponent(Light, { radius: 8 });

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
			layer: Layer.map.get(),
		});

		this.addComponent(InputHandler);
		this.addComponent(AudioListener);
	}
}


class InputHandler extends Component {
	private v: Vec2 = new Vec2();

	public start(): void {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
					this.v.x = -1;
					break;
				case "s":
					this.v.y = -1;
					break;
				case "d":
					this.v.x = 1;
					break;
				case "w":
					this.v.y = 1;
					break;
			}
			this.v.normalize();
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
				case "d":
					this.v.x = 0;
					break
				case "s":
				case "w":
					this.v.y = 0;
					break;
			}
			this.v.normalize();
		});

		let isSliding = false;

		let start = [0, 0];

		window.addEventListener("touchstart", (e) => {
			isSliding = true;
			start = [e.touches[0]!.clientX, e.touches[0]!.clientY];
		});

		window.addEventListener("touchmove", (e) => {
			if (!isSliding)
				return;
			const x = e.touches[0].clientX;
			const y = e.touches[0].clientY;
			const [sx, sy] = start;
			this.v = new Vec2(x - sx, -(y - sy)).normalize();
		})

		window.addEventListener("touchend", () => {
			isSliding = false;
			this.v = new Vec2(0, 0);
		});
	}

	public update(): void {
		this.transform.position.add(Vec2.scale(this.v, Time.delta * 3));
	}
}
