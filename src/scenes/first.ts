import { Camera, Sprite, SpriteRenderer } from "../gfx";
import type { RegistryItem } from "../registry";
import { GameObject } from "../game-object";
import { Scene } from "../scene";
import { Vec2 } from "../vec";
import { Light } from "../gfx/light";
import { ShadowCaster } from "../gfx/shadow-caster";
import { Color } from "../color";

export class First extends Scene {
	public async load(): Promise<void> {
		const c = this.spawn().addComponent(Camera);
		
		this.spawn(Platform, Sprite.background, new Vec2(0, -3));

		for (let i = -10; i < 10; i++) {
			this.spawn(Platform, Sprite.platform, new Vec2(i * 3, Math.sin(i) * 2));
			this.spawn(Platform, Sprite.platform, new Vec2(i * 3, 4 + Math.cos(i)));
		}

		const l = this.spawn(LightTest);
		this.spawn(LightTest, new Vec2(6, 4), new Color(1, 0.7, 0.7, 1), 5);

		window.addEventListener("mousemove", (e) => {
			l.transform.position = c.screenToWorld(new Vec2(e.clientX, e.clientY));
		});
	}
}

class Platform extends GameObject {
	public constructor(scene: Scene, sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super(scene);
		this.transform.position = position;
		this.addComponent(SpriteRenderer).sprite = sprite.get();
		this.addComponent(ShadowCaster);
	}
}

class LightTest extends GameObject {
	public constructor(scene: Scene, position: Vec2 = new Vec2(), color: Color = new Color(1, 1, 1, 1), radius: number = 10) {
		super(scene);
		this.transform.position = position;
		this.transform.zIndex = -1;
		const l = this.addComponent(Light);
		l.color = color;
		l.radius = radius;
		this.addComponent(SpriteRenderer).sprite = Sprite.light.get();

		let down = false;
		let px = 0;
		let py = 0;

		window.addEventListener("touchstart", (e) => {
			px = e.touches[0]!.clientX;
			py = e.touches[0]!.clientY;
			down = true;
		});

		window.addEventListener("touchmove", (e) => {
			const x = e.touches[0]!.clientX;
			const y = e.touches[0]!.clientY;

			if (down) {
				this.v.x = (x - px) / 4;
				this.v.y = -(y - py) / 4;
			}
			px = x;
			py = y;
			console.log(this.v.x, -this.v.y);
		});

		window.addEventListener("touchend", (e) => {
			down = false;
			this.v = new Vec2()
		});

		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
					this.v.x = -1;
					break;
				case "s":
					this.v.y = -1;
					break;
				case "d":
					this.v.x = 1;
					break;
				case "w":
					this.v.y = 1;
					break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
					this.v.x = 0;
					break;
				case "s":
					this.v.y = 0;
					break;
				case "d":
					this.v.x = 0;
					break;
				case "w":
					this.v.y = 0;
					break;
			}
		});

		this.v.normalize();
	}

	v = new Vec2(0, 0);

	public update(delta: number): void {
		this.transform.position.add(Vec2.scale(this.v, delta * 5));
	}
}