import { Camera, Sprite, SpriteRenderer } from "../gfx";
import type { RegistryItem } from "../registry";
import { GameObject } from "../game-object";
import { Scene } from "../scene";
import { Vec2 } from "../vec";
import { ShadowCaster } from "../gfx/shadow-caster";
import { Light } from "../gfx/light";
import { Component } from "../component";

export class First extends Scene {
	public async load(): Promise<void> {
		this.spawn().addComponent(Camera);
		const l = this.spawn()
		const light = l.addComponent(Light);
		l.addComponent(T);
		l.addComponent(SpriteRenderer).sprite = Sprite.light.get();
		light.radius = 3;

		this.spawn(Platform, Sprite.platform, new Vec2(2, 2));
		this.spawn(Platform, Sprite.platform, new Vec2(-2, 3));
		this.spawn(Platform, Sprite.platform, new Vec2(-3, -2));
		this.spawn(Platform, Sprite.platform, new Vec2(3, -2));
		
	}
}

class Platform extends GameObject {
	public constructor(scene: Scene, sprite: RegistryItem<Sprite>, position: Vec2 = new Vec2()) {
		super(scene);
		this.transform.position = position;
		this.addComponent(SpriteRenderer).sprite = sprite.get();
		const sc = this.addComponent(ShadowCaster);
		sc.caster.points.forEach(p => {
			p.x *= 0.6;
			p.y *= 0.12;
		});
	}
}

class T extends Component {
	private v: number = 1;
	private max: number = 4.5;
	
	public update(delta: number) {
		if(this.transform.position.y > this.max) {
			this.v = -1;
		} else if(this.transform.position.y < -this.max) {
			this.v = 1;
		}
		this.transform.position.y += this.v * delta;
	}
}


//class T2 extends Component {
//	private v: number = -0.02;
	
//	public update() {
//		if(this.transform.position.y > 2) {
//			this.v = -0.002;
//		} else if(this.transform.position.y < -2) {
//			this.v = +0.002;
//		}
//		this.transform.position.y += this.v;
//	}
//}