import type { Socket } from "socket.io-client";
import { Component, GameObject, Light, SpriteRenderer, Vec2, AudioListener, BoxCollider, Rigidbody, Camera, Animator } from "../../engine";
import * as sprites from "../sprites";
import { SceneManager } from "../../engine/scene-manager";
import { UI } from "../../engine/gfx/ui";
import { layers } from "../layers";
import { Layer } from "../../engine/gfx/layers";
import { playerAnimation, playerWalkingAnimation } from "../animations";
import { clamp } from "../../utils";
import { Input } from "../../engine/input";

export class NetworkPlayer extends GameObject {
	public constructor(position: Vec2 = new Vec2) {
		super();

		this.transform.position = position;

		this.addComponent(Light, {
			radius: 8,
			targetLayers: [
				Layer.default.get(),
				layers.entities.get(),
				layers.map.get(),
				layers.foreground.get(),
			]
		});

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
			layer: layers.map.get(),
		});

		this.addComponent(Animator, {
			animation: playerAnimation.get()
		});
	}
}

export class Player extends GameObject {
	public constructor(position: Vec2 = new Vec2, socket: Socket | null) {
		super();

		this.transform.position = position;

		this.addComponent(Light, {
			radius: 8,
			targetLayers: [
				Layer.default.get(),
				layers.entities.get(),
				layers.map.get(),
				layers.foreground.get(),
			]
		});

		this.addComponent(Animator, {
			animation: playerAnimation.get(),
			offset: Math.random() * 1000,
		});

		this.addComponent(SpriteRenderer, {
			sprite: sprites.player.get(),
			layer: layers.map.get(),
		});

		this.addComponent(Rigidbody);
		this.addComponent(InputHandler, { socket });
		this.addComponent(AudioListener);
		this.addComponent(BoxCollider, {});
		this.addComponent(MapBorder);
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
	public readonly animator: Animator;

	public speed: number = 0.46;
	public socket: Socket | null = null;

	private readonly touchStartOffset: number = 25;

	private _prevPosition: Vec2;
	private _touchBtn: UiTouchBtn;
	private _isWalking: boolean = false;
	private _isGrounded: boolean = false;

	public constructor(gameObject: GameObject) {
		super(gameObject);
		this._prevPosition = this.transform.position.clone();
		this.rb = this.getComponent(Rigidbody)!;
		this.renderer = this.getComponent(SpriteRenderer)!;
		this.animator = this.getComponent(Animator)!;

		const camera = SceneManager.activeScene.getComponents(Camera)[0]!;

		this._touchBtn = SceneManager.activeScene.spawn(camera.screenToWorld(new Vec2(0, 0))).addComponent(UiTouchBtn);
	}

	public onCollision(col: BoxCollider): void {
		if (col.gameObject.tag === "Platform") {
			this._isGrounded = true;
		}
	}

	public onCollisionLeave(col: BoxCollider): void {
		if (col.gameObject.tag === "Platform") {
			this._isGrounded = false;
		}
	}

	public onUpdate(): void {
		if (Input.touch && Input.touchStart) {
			const camera = SceneManager.activeScene.getComponents(Camera)[0]!;

			this._touchBtn.transform.position = camera.screenToWorld(Input.touchStart).sub(camera.transform.position);
			this._touchBtn.thumb.transform.position = camera.screenToWorld(Input.touch).sub(camera.transform.position);

			this._touchBtn.show();

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
			this._touchBtn.hide();

			if (Input.isDown("a") && Input.isUp("d")) {
				this.rb.velocity.x = -1 * this.speed;
				this.renderer.flip = true;
			} else if (Input.isUp("a") && Input.isDown("d")) {
				this.rb.velocity.x = 1 * this.speed;
				this.renderer.flip = false;
			} else {
				this.rb.velocity.x = 0;
			}
			if (this._isGrounded && Input.isDown("space")) {
				this.rb.velocity.y = 3;
			}
		}

		const isWalking = this.rb.velocity.x !== 0;

		if (isWalking !== this._isWalking) {
			if (isWalking) {
				this.animator.animation = playerWalkingAnimation.get();
			} else {
				this.animator.animation = playerAnimation.get();
			}
		}

		if (this.socket && (Vec2.distance(this._prevPosition, this.transform.position) > 0 || isWalking !== this._isWalking)) {
			this._prevPosition = this.transform.position.clone();
			const { x, y } = this.transform.position;
			this.socket.emit("player-update", { x, y, isWalking });
		}

		this._isWalking = isWalking
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

class MapBorder extends Component {
	public readonly offset: Vec2 = new Vec2(0, 0);
	public readonly size: Vec2 = new Vec2(13, 7);

	public onUpdate(): void {
		const { x, y } = this.transform.position;
		
		this.transform.position.x = clamp(x, this.offset.x - this.size.x, this.offset.x + this.size.x);
		this.transform.position.y = clamp(y, this.offset.y - this.size.y, this.offset.y + this.size.y);
	}
}