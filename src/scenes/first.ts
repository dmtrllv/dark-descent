import { ShadowCaster, Scene, Camera, Vec2, SpriteRenderer, Layer, Color, GameObject, RegistryItem, Sprite, Light, Component, Transform, Animator } from "../engine";

import * as sprites from "../sprites";
import { fireAnimation } from "../animations";
import { bird1, bird2, bird3, fireCrackles } from "../audio";
import { AudioEmitter } from "../engine/audio-emitter";
import { AudioListener } from "../engine/audio-listener";

export class FirstScene extends Scene {
	public async onLoad(): Promise<void> {
		const c = this.spawn().addComponent(Camera);
		const follow = c.addComponent(Follower);

		// set background and moon
		this.spawn(Moon, c.transform, new Vec2(-3, 7));

		const background = this.spawn(new Vec2(0, -3)).addComponent(SpriteRenderer);
		background.sprite = sprites.background.get();
		background.layer = Layer.background.get();

		// spawn random platforms
		for (let i = -10; i < 10; i++) {
			this.spawn(Platform, sprites.platform, new Vec2(i * 3, Math.sin(i) * 2));
			this.spawn(Platform, sprites.platform, new Vec2(i * 3, 4 + Math.cos(i)));
		}

		// spawn main light and set camera follow target
		follow.target = this.spawn(LightTest).transform;

		this.spawn(Fire, new Vec2(-7, -1.3));
		this.spawn(Fire, new Vec2(5, 4));

		const birds = [
			bird1.get(),
			bird2.get(),
			bird3.get(),
		];

		const playBirds = () => {
			const bird = birds[Math.round(Math.random() * 2)];
			if (!bird) {
				return playBirds();
			}

			bird.play().then(() => {
				bird["audio"].volume = Math.random();
				setTimeout(() => {
					playBirds();
				}, Math.random() * 16000);
			});
		};

		playBirds();
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
		this.addComponent(Movable);
		this.addComponent(AudioListener);
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

		let isSliding = false;

		let start = [0, 0];

		window.addEventListener("touchstart", (e) => {
			isSliding = true;
			start = [e.touches[0]!.clientX, e.touches[0]!.clientY];
		});

		window.addEventListener("touchmove", (e) => {
			if (!isSliding)
				return;
			const x = e.touches[0].clientX;
			const y = e.touches[0].clientY;
			const [sx, sy] = start;
			this.v = new Vec2(x - sx, -(y - sy)).normalize();
		})

		window.addEventListener("touchend", () => {
			isSliding = false;
			this.v = new Vec2(0, 0);
		});
	}

	public update(delta: number): void {
		this.transform.position.add(Vec2.scale(this.v, delta * 3))
	}
}

class Fire extends GameObject {
	public constructor(scene: Scene, position: Vec2 = new Vec2()) {
		super(scene);
		this.transform.position = position;
		const r = this.addComponent(SpriteRenderer);

		r.layer = Layer.map.get();
		this.addComponent(Light).radius = 3;

		const animator = this.addComponent(Animator);
		animator.animation = fireAnimation.get();
		animator.offset = Math.random() * 1000;

		const audioEmitter = this.addComponent(AudioEmitter);
		audioEmitter.audio = fireCrackles.get().clone();
		audioEmitter.audio.repeat(Math.random() * 6000, 100);

		this.addComponent(FireLight);
	}
}

class FireLight extends Component {
	private light: Light | null = null;

	public start(): void {
		this.light = this.getComponent(Light);
	}

	public update(): void {
		if (this.light && (Math.random() > 0.7))
			this.light.intensity = (Math.random() * 0.15) + 0.82;
	}
}

class Moon extends GameObject {
	public readonly camera: Transform;

	public constructor(scene: Scene, camera: Transform, position: Vec2 = new Vec2()) {
		super(scene);
		this.camera = camera;
		this.transform.position = position;

		const r = this.addComponent(SpriteRenderer);
		r.sprite = sprites.moon.get();
		r.layer = Layer.background.get();
		this.addComponent(Light).radius = 5;
		this.addComponent(MoonFollower).camera = camera;
	}
}

class MoonFollower extends Component {
	public camera: Transform | null = null;

	public update(): void {
		if (this.camera) {
			this.transform.position.x = (this.camera.position.x - 3) / 3;
			this.transform.position.y = (this.camera.position.y + 20) / 3;
		}
	}
}