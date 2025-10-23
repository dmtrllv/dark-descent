import type { Socket } from "socket.io-client";
import { Component, GameObject, Light, SpriteRenderer, Vec2, AudioListener, BoxCollider, Collider, Rigidbody, Camera } from "../engine";
import { Input } from "../engine/input";
import * as sprites from "../sprites";
import { clamp } from "../utils";
import { SceneManager } from "../engine/scene-manager";
import { UI } from "../engine/gfx/ui";

export class NetworkPlayer extends GameObject {
	public constructor(position: Vec2 = new Vec2) {
		super();

		this.transform.position = position;

		this.addComponent(Light, { radius: 8 });

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
		});
	}
}

export class Player extends GameObject {
	public constructor(position: Vec2 = new Vec2, socket: Socket | null) {
		super();

		this.transform.position = position;

		this.addComponent(Light, { radius: 8 });

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
		});

		this.addComponent(Rigidbody);
		this.addComponent(InputHandler, { socket });
		this.addComponent(AudioListener);
		this.addComponent(BoxCollider, {
			size: new Vec2(0.02, 1)
		});
	}

	public destroy = () => {
		const scene = SceneManager.activeScene;
		this.components.forEach(c => {
			scene.removeComponent(c);
		});
		scene.removeGameObject(this);
	}

}


class InputHandler extends Component {
	public readonly rb: Rigidbody;
	public readonly renderer: SpriteRenderer;
	public readonly speed: number = 0.7;
	public readonly touchStartOffset: number = 25;

	private _prevPosition: Vec2;
	public socket: Socket | null = null;
	private touchBtn: UiTouchBtn;

	public constructor(gameObject: GameObject) {
		super(gameObject);
		this._prevPosition = this.transform.position.clone();
		this.rb = this.getComponent(Rigidbody)!;
		this.renderer = this.getComponent(SpriteRenderer)!;

		const camera = SceneManager.activeScene.getComponents(Camera)[0]!;

		this.touchBtn = SceneManager.activeScene.spawn(camera.screenToWorld(new Vec2(0, 0))).addComponent(UiTouchBtn);
	}

	public onCollision(col: Collider): void {
		const y = this.transform.position.y - 1;
		const delta = (col.transform.position.y + col.top) - y;
		this.transform.position.y += delta;
		this.rb.velocity.y = 0;
	}

	public onUpdate(): void {
		if (Input.touch && Input.touchStart) {
			const camera = SceneManager.activeScene.getComponents(Camera)[0]!;

			this.touchBtn.transform.position = camera.screenToWorld(Input.touchStart).sub(camera.transform.position);
			this.touchBtn.thumb.transform.position = camera.screenToWorld(Input.touch).sub(camera.transform.position);

			this.touchBtn.show();

			const delta = Input.touchStart.x - Input.touch.x;
			if (delta > this.touchStartOffset) {
				this.rb.velocity.x = -1 * this.speed;
				this.renderer.flip = true;
			} else if (delta < -this.touchStartOffset) {
				this.rb.velocity.x = 1 * this.speed;
				this.renderer.flip = false;
			} else {
				this.rb.velocity.x = 0;
			}
		} else {
			this.touchBtn.hide();

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

		if (this.socket && Vec2.distance(this._prevPosition, this.transform.position) > 0) {
			this._prevPosition = this.transform.position.clone();
			const { x, y } = this.transform.position;
			this.socket.emit("player-update", { x, y });
		}
	}
}

class UiTouchBtn extends Component {
	private readonly btn = this.addComponent(UI, {
		sprite: sprites.touchCircle.get(),
	});

	public readonly thumb = SceneManager.activeScene.spawn().addComponent(UI, {
		sprite: sprites.touchCircleBtn.get(),
	});

	public readonly hide = () => {
		this.btn.hidden = true;
		this.thumb.hidden = true;
	};

	public readonly show = () => {
		this.btn.hidden = false;
		this.thumb.hidden = false;
	};
}