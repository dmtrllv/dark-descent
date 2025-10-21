import { Camera, Sprite, SpriteRenderer } from "../gfx";
import type { RegistryItem } from "../registry";
import { GameObject } from "../game-object";
import { Scene } from "../scene";
import { Vec2 } from "../vec";
import { Light } from "../gfx/light";
import { ShadowCaster } from "../gfx/shadow-caster";
import { Color } from "../color";
import { Layer } from "../gfx/layer";

export class First extends Scene {
	public async load(): Promise<void> {
		const c = this.spawn().addComponent(Camera);

		// set background
		const background = this.spawn(new Vec2(0, -3)).addComponent(SpriteRenderer);
		background.sprite = Sprite.background.get();
		background.layer = Layer.background.get();
		
		// spawn random platforms
		for (let i = -10; i < 10; i++) {
			this.spawn(Platform, Sprite.platform, new Vec2(i * 3, Math.sin(i) * 2));
			this.spawn(Platform, Sprite.platform, new Vec2(i * 3, 4 + Math.cos(i)));
		}

		// spawn main light
		const l = this.spawn(LightTest);

		// add a 2nd redish light
		this.spawn(LightTest, new Vec2(6, 4), new Color(1, 0.7, 0.7, 1), 6);

		window.addEventListener("mousemove", (e) => {
			l.transform.position = c.screenToWorld(new Vec2(e.clientX, e.clientY));
		});
	}
}

class Platform extends GameObject {
	public constructor(scene: Scene, sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super(scene);
		this.transform.position = position;
		const r = this.addComponent(SpriteRenderer);
		r.sprite = sprite.get();
		r.layer = Layer.map.get();
		this.addComponent(ShadowCaster);
	}
}

class LightTest extends GameObject {
	public constructor(scene: Scene, position: Vec2 = new Vec2(), color: Color = new Color(1, 1, 1, 1), radius: number = 10) {
		super(scene);
		this.transform.position = position;
		const l = this.addComponent(Light);
		l.color = color;
		l.radius = radius;const r = this.addComponent(SpriteRenderer);
		r.sprite = Sprite.light.get();
		r.layer = Layer.map.get();
	}
}