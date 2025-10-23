import { GameObject, RegistryItem, Sprite, SpriteRenderer, Vec2 } from "../engine";
import { SceneManager } from "../engine/scene-manager";
import { Platform } from "./platform";

export class Map extends GameObject {
	public constructor({ backgrounds, platforms }: MapProps) {
		super();

		const scene = SceneManager.activeScene;

		backgrounds.forEach(b => {
			scene.spawn().addComponent(SpriteRenderer, {
				sprite: b.get()
			});
		});

		platforms.forEach(p => {
			scene.spawn(Platform, p.background, p.position);
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