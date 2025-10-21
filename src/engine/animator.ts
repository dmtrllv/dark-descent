import { Animation } from "./animation";
import { Component } from "./component";
import { SpriteRenderer } from "./gfx";

export class Animator extends Component {
	public animation: Animation = new Animation(0, []);

	public startTime: number = Date.now();
	private sr: SpriteRenderer | null = null;

	public start(): void {
		this.sr = this.gameObject.getComponent(SpriteRenderer);
		console.log("start");
	}

	update() {
		if(!this.sr)
			return;

		const delta = Date.now() - this.startTime;
		const frame = Math.floor((delta / this.animation.speed)) % this.animation.keyframes.length;
		this.sr.sprite = this.animation.keyframes[frame];
	}
}