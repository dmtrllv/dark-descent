import { Component, GameObject, Layer, Light, SpriteRenderer, Vec2, AudioListener, BoxCollider, Collider, Rigidbody } from "../engine";
import { Input } from "../engine/input";

import * as sprites from "../sprites";
import { clamp } from "../utils";

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
	public readonly renderer: SpriteRenderer;
	public readonly speed: number = 0.7;

	private isSliding = false;
	public constructor(gameObject: GameObject) {
		super(gameObject);
		this.rb = this.getComponent(Rigidbody)!;
		this.renderer = this.getComponent(SpriteRenderer)!;

		let didJump = false;

		let downPos = new Vec2(0, 0);

		window.addEventListener("touchstart", (e) => {
			const { clientX, clientY } = e.touches[0]!;
			this.isSliding = true;
			downPos = new Vec2(clientX, clientY);
		});

		window.addEventListener("touchmove", (e) => {
			if (!this.isSliding)
				return;

			const { clientX, clientY } = e.touches[0]!;
			const p = new Vec2(clientX, clientY);

			const offset = p.sub(downPos);
			if (offset.x > 0) {
				this.rb.velocity.x = 1 * this.speed;
				this.renderer.flip = false;
			} else if (offset.x < 0) {
				this.rb.velocity.x = -1 * this.speed;
				this.renderer.flip = true;
			}

			if (offset.y < 0 && !didJump) {
				this.rb.velocity.y = 3;
				didJump = true;
				setTimeout(() => {
					didJump = false;
				}, 400);
			}
		});

		window.addEventListener("touchend", () => {
			this.isSliding = false;
		})
	}

	public onCollision(col: Collider): void {
		const y = this.transform.position.y - 1;
		const delta = (col.transform.position.y + col.top) - y;
		this.transform.position.y += delta;
		this.rb.velocity.y = 0;
	}

	public onUpdate(): void {
		if (!this.isSliding) {
			if (Input.isDown("a") && Input.isUp("d")) {
				this.rb.velocity.x = -1 * this.speed;
				this.renderer.flip = true;
			} else if (Input.isUp("a") && Input.isDown("d")) {
				this.rb.velocity.x = 1 * this.speed;
				this.renderer.flip = false;
			} else {
				this.rb.velocity.x = 0;
			}
			if (Input.wentDown("space")) {
				this.rb.velocity.y = 3;
			}
		}

		if (this.transform.position.y < -3) {
			this.rb.velocity.y = 0;
			this.transform.position.y += 0.01;
		} else {
			this.transform.position.y = clamp(this.transform.position.y, -3, 10);
		}
	}
}
