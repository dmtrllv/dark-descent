import { GameObject, LineCollider, RegistryItem, ShadowCaster, Sprite, SpriteRenderer, Vec2 } from "../../engine";
import { layers } from "../layers";
import { platform } from "../sprites";

export class Platform extends GameObject {
	public static default(position?: Vec2): Platform {
		return new Platform(platform, position);
	}

	public constructor(sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super();
		this.transform.position = position;
		this.addComponent(SpriteRenderer, {
			sprite: sprite.get(),
			layer: layers.map.get(),
		});

		this.addComponent(ShadowCaster, {});

		this.addComponent(LineCollider, {
			start: new Vec2(-1.5, 0),
			end: new Vec2(1.5, 0),
		});
	}
}