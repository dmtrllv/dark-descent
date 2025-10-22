import { Animation } from "./animation";
import { Component } from "./component";
import { SpriteRenderer } from "./gfx";

export class Animator extends Component {
	public animation: Animation = new Animation(0, []);
	public offset: number = 0;

	public startTime: number = performance.now();
	private sr: SpriteRenderer | null = null;

	public start(): void {
		this.sr = this.gameObject.getComponent(SpriteRenderer);
	}

	update() {
		if(!this.sr)
			return;

		const delta = performance.now() - this.startTime + this.offset;
		const frame = Math.floor((delta / this.animation.speed)) % this.animation.keyframes.length;
		this.sr.sprite = this.animation.keyframes[frame];
	}
}