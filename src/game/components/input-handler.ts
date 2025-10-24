import type { Socket } from "socket.io-client";
import { Component, GameObject, SpriteRenderer, Vec2, BoxCollider, Rigidbody, Camera, Animator } from "../../engine";
import { SceneManager } from "../../engine/scene-manager";
import { playerAnimation, playerWalkingAnimation } from "../animations";
import { Input } from "../../engine/input";
import { UI } from "../../engine/gfx/ui";
import * as sprites from "../sprites";

export class InputHandler extends Component {
	public readonly rb: Rigidbody;
	public readonly renderer: SpriteRenderer;
	public readonly animator: Animator;

	public speed: number = 0.46;
	public jumpForce: number = 2.5;
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
				this.rb.velocity.y = this.jumpForce;
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

		this._isWalking = isWalking;
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
