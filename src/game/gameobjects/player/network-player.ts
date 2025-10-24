import { GameObject, Light, SpriteRenderer, Vec2, Animator } from "../../../engine";
import * as sprites from "../../sprites";
import { layers } from "../../layers";
import { Layer } from "../../../engine/gfx/layers";
import { playerAnimation } from "../../animations";

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