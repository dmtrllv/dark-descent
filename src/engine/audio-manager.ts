import { Audio } from "./audio";

export class AudioManager {
	public constructor() {

	}

	public readonly load = async () => {
		await Audio.registry.load(this);
	}

	public readonly play = (audio: Audio, oneShot: boolean = true) => {
		audio["audio"].currentTime = 0
		audio["audio"].play();
		
		const onEnd = () => {
			audio["audio"].removeEventListener("ended", onEnd);
			if (!oneShot) {
				this.play(audio, oneShot);
			}
		};
		audio["audio"].addEventListener("ended", onEnd);
	}
}