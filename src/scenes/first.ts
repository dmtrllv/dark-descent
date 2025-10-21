import { ShadowCaster, Scene, Camera, Vec2, SpriteRenderer, Layer, Color, GameObject, RegistryItem, Sprite, Light, Component, Transform, Animator } from "../engine";

import * as sprites from "../sprites";
import * as songs from "../songs";
import { fireAnimation } from "../animations";
import { fireCrackles } from "../audio";

export class FirstScene extends Scene {
	public async load(): Promise<void> {
		const c = this.spawn().addComponent(Camera);
		const f = c.gameObject.addComponent(Follower);

		// set background
		const background = this.spawn(new Vec2(0, -3)).addComponent(SpriteRenderer);
		background.sprite = sprites.background.get();
		background.layer = Layer.background.get();

		// spawn random platforms
		for (let i = -10; i < 10; i++) {
			this.spawn(Platform, sprites.platform, new Vec2(i * 3, Math.sin(i) * 2));
			this.spawn(Platform, sprites.platform, new Vec2(i * 3, 4 + Math.cos(i)));
		}

		// spawn main light
		const l = this.spawn(LightTest);
		l.addComponent(Movable);

		f.target = l.transform;

		// add a 2nd redish light
		this.spawn(LightTest, new Vec2(6, 4), new Color(1, 0.7, 0.7, 1), 6);

		window.addEventListener("mousemove", (e) => {
			l.transform.position = c.screenToWorld(new Vec2(e.clientX, e.clientY));
		});

		songs.intro2.get().play().then(() => { });

		const fire = fireCrackles.get();

		const playFire = () => {
			console.log("play");
			fire.play();
			setTimeout(() => {
				playFire()
			}, (fire["audio"].duration * 1000) - 200);
		}

		playFire();

		const r = this.spawn(new Vec2(0, 0.5)).addComponent(SpriteRenderer);
		r.layer = Layer.map.get();
		r.gameObject.addComponent(Light).radius = 2;
		r.gameObject.addComponent(Animator).animation = fireAnimation.get();
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
		l.radius = radius; const r = this.addComponent(SpriteRenderer);
		r.sprite = sprites.light.get();
		r.layer = Layer.map.get();
	}
}

class Follower extends Component {
	public target: Transform | null = null;

	public update(_delta: number): void {
		if (!this.target)
			return;

		const radius = 1;

		let offsetX = this.target.position.x - this.transform.position.x;
		let offsetY = this.target.position.y - this.transform.position.y;

		if (offsetX < radius && offsetX > -radius) {
			offsetX = 0;
		}

		if (offsetY < radius && offsetY > -radius) {
			offsetY = 0;
		}

		const x = (offsetX * (_delta / 2));
		const y = (offsetY * (_delta / 2));

		const px = this.transform.position.x;
		const py = this.transform.position.y;

		this.transform.position.x = px + x;
		this.transform.position.y = py + y;
	}
}

class Movable extends Component {
	private v: Vec2 = new Vec2();

	public start(): void {
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
			this.v.normalize();
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
				case "d":
					this.v.x = 0;
					break
				case "s":
				case "w":
					this.v.y = 0;
					break;
			}
			this.v.normalize();
		});
	}

	public update(delta: number): void {
		this.transform.position.add(Vec2.scale(this.v, delta * 3))
	}
}