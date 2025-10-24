import { BoxCollider, GameObject, RegistryItem, ShadowCaster, Sprite, SpriteRenderer, Vec2 } from "../../engine";
import { layers } from "../layers";
import { platform } from "../sprites";

export class Platform extends GameObject {
	public static default(position?: Vec2): Platform {
		return new Platform(platform, position);
	}

	public constructor(sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super();
		this.tag = "Platform";
		this.transform.position = position;
		this.addComponent(SpriteRenderer, {
			sprite: sprite.get(),
			layer: layers.map.get(),
		});

		this.addComponent(ShadowCaster, {});

		this.addComponent(BoxCollider, {
			size: new Vec2(2, 0.25),
			offset: new Vec2(0, -0.1),
		});
	}
}