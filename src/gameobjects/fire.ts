import { fireAnimation } from "../animations";
import { fireCrackles } from "../audio";
import { GameObject, Vec2, SpriteRenderer, Layer, Light, Animator, Component } from "../engine";
import { AudioEmitter } from "../engine/audio-emitter";

export class Fire extends GameObject {
	public constructor(position: Vec2 = new Vec2()) {
		super();
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

	public onStart(): void {
		this.light = this.getComponent(Light);
	}

	public onUpdate(): void {
		if (this.light && (Math.random() > 0.7))
			this.light.intensity = (Math.random() * 0.15) + 0.82;
	}
}
