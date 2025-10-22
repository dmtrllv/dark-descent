import { clamp } from "../utils";
import { Audio } from "./audio";
import { AudioEmitter } from "./audio-emitter";
import { AudioListener } from "./audio-listener";
import type { Scene } from "./scene";
import { Vec2 } from "./vec";

export class AudioManager {
	private static readonly instance_ = new AudioManager();
	public static readonly load = this.instance_.load.bind(this.instance_);
	public static readonly play = this.instance_.play.bind(this.instance_);
	public static readonly tick = this.instance_.update.bind(this.instance_);

	private readonly _playingAudio: Audio[] = [];

	public readonly load = async () => {
		await Audio.registry.load(this);
	}

	public readonly play = (audio: Audio, oneShot: boolean = true, startOffset: number = 0, endOffset: number = 0) => {
		const a = audio["audio"];
		
		a.currentTime = startOffset / 1000;

		if (!oneShot) {
			const play = () => {
				a.play();
				setTimeout(() => {
					a.currentTime = 0;
					play()
				}, (a.duration * 1000) - endOffset);
			}
			play();
		} else {
			a.play();

			const onEnd = () => {
				audio["audio"].removeEventListener("ended", onEnd);
				const index = this._playingAudio.indexOf(audio);
				if (index > -1)
					this._playingAudio.splice(index, 1);
			};

			audio["audio"].addEventListener("ended", onEnd);
		}
	}

	public update(scene: Scene) {
		const emitters = scene.getComponents(AudioEmitter);
		const listeners = scene.getComponents(AudioListener);
		const listener = listeners[0];
		if (!listener)
			return;
		for (const e of emitters) {
			const distance = Vec2.distance(e.transform.position, listener.transform.position);
			e.audio!["audio"].volume = clamp(1 - (distance / e.radius), 0, 1);
		}
	}
}