import { GameObject, Layer, RegistryItem, Sprite, SpriteRenderer, Vec2 } from "../engine";

export class Map extends GameObject {
	public constructor({ backgrounds, platforms }: MapProps) {
		super();

		const bg = Layer.background.get();

		backgrounds.forEach(b => {
			this.spawn().addComponent(SpriteRenderer, {
				layer: bg,
				sprite: b.get()
			});
		});

		const platformLayer = Layer.map.get();

		platforms.forEach(p => {
			this.spawn(p.position).addComponent(SpriteRenderer, {
				layer: platformLayer,
				sprite: p.background.get()
			});
		});
	}
}

export type MapProps = {
	readonly backgrounds: RegistryItem<Sprite>[];
	readonly platforms: PlatformProps[];
}

export type PlatformProps = {
	readonly background: RegistryItem<Sprite>;
	readonly foreground?: RegistryItem<Sprite>;
	readonly position: Vec2;
}