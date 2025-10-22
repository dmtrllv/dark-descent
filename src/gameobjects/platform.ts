import { GameObject, Layer, RegistryItem, ShadowCaster, Sprite, SpriteRenderer, Vec2 } from "../engine";

export class Platform extends GameObject {
	public constructor(sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super();
		this.transform.position = position;
		const r = this.addComponent(SpriteRenderer);
		r.sprite = sprite.get();
		r.layer = Layer.map.get();
		this.addComponent(ShadowCaster);
	}
}