import type { AudioManager } from "./audio-manager";
import { Registry } from "./registry";

export class Audio {
	private readonly manager: AudioManager;
	private readonly audio: HTMLAudioElement;

	private constructor(manager: AudioManager, path: string) {
		this.manager = manager;
		this.audio = new window.Audio(path);
	}

	public static readonly registry = new Registry<Audio, [AudioManager]>();

	private static readonly register = (path: string) => this.registry.register((manager) => {
		return new Promise((res) => {
			const a = new Audio(manager, path);
			a.audio.addEventListener("canplaythrough", () => {
				res(a);
			});
		});
	});

	public readonly play = (oneShot: boolean = true) => {
		this.manager.play(this, oneShot);
	}

	public static readonly songs = {
		intro: this.register("/audio/songs/intro.wav"),
	} as const;
}