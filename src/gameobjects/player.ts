import { Component, GameObject, Layer, Light, SpriteRenderer, Vec2, AudioListener, BoxCollider, Collider, Rigidbody } from "../engine";

import * as sprites from "../sprites";

export class Player extends GameObject {
	public constructor(position: Vec2 = new Vec2) {
		super();

		this.transform.position = position;

		this.addComponent(Light, { radius: 8 });

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
			layer: Layer.map.get(),
		});

		this.addComponent(Rigidbody);
		this.addComponent(InputHandler);
		this.addComponent(AudioListener);
		this.addComponent(BoxCollider, {
			size: new Vec2(0.02, 1)
		});
	}
}


class InputHandler extends Component {
	public readonly rb: Rigidbody;

	public constructor(gameObject: GameObject) {
		super(gameObject);
		this.rb = this.gameObject.getComponent(Rigidbody)!;
	}

	public onStart(): void {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
					this.rb.velocity.x = -1;
					break;
				case "d":
					this.rb.velocity.x = 1;
					break;
			}
		});

		let didJump = false;

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
				case "d":
					this.rb.velocity.x = 0;
					break;
				case " ":
					didJump = false;
					break;
			}
		});

		window.addEventListener("keypress", (e) => {
			if(didJump)
				return;
			
			switch (e.key.toLowerCase()) {
				case " ":
					this.rb.velocity.y = 3;
					didJump = true;
					break
			}
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
			this.rb.velocity = new Vec2(x - sx, -(y - sy)).normalize();
		})

		window.addEventListener("touchend", () => {
			isSliding = false;
			this.rb.velocity = new Vec2(0, 0);
		});
	}

	public onCollision(col: Collider): void {
		const y = this.transform.position.y - 1;
		const delta = (col.transform.position.y + col.top) - y;
		this.transform.position.y += delta;
		this.rb.velocity.y = 0;
	}
}
