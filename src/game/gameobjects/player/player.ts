import type { Socket } from "socket.io-client";
import { Component, GameObject, Light, SpriteRenderer, Vec2, AudioListener, BoxCollider, Rigidbody, Animator } from "../../../engine";
import * as sprites from "../../sprites";
import { SceneManager } from "../../../engine/scene-manager";
import { layers } from "../../layers";
import { Layer } from "../../../engine/gfx/layers";
import { playerAnimation, } from "../../animations";
import { clamp } from "../../../utils";
import { InputHandler } from "../../components/input-handler";

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
		this.addComponent(BoxCollider, {
			size: new Vec2(0.8, 2)
		});
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

class MapBorder extends Component {
	public readonly offset: Vec2 = new Vec2(0, 0);
	public readonly size: Vec2 = new Vec2(13, 7);

	public onUpdate(): void {
		const { x, y } = this.transform.position;
		
		this.transform.position.x = clamp(x, this.offset.x - this.size.x, this.offset.x + this.size.x);
		this.transform.position.y = clamp(y, this.offset.y - this.size.y, this.offset.y + this.size.y);
	}
}