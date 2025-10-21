import type { AudioManager } from "./audio-manager";
import { Registry } from "./registry";

export class Audio {
	private readonly manager: AudioManager;
	private readonly audio: HTMLAudioElement;

	private constructor(manager: AudioManager, path: string | typeof window.Audio) {
		this.manager = manager;
		this.audio = path instanceof window.Audio ? path : new window.Audio(path as string);
	}

	public static readonly registry = new Registry<Audio, [AudioManager]>();

	public static readonly register = (path: string) => this.registry.register((manager) => {
		return new Promise((res) => {
			const a = new Audio(manager, path);
			a.audio.addEventListener("canplaythrough", () => {
				res(a);
			});
		});
	});

	public readonly play = (oneShot: boolean = true): Promise<void> => {
		this.manager.play(this, oneShot);
		return new Promise((res) => {
			this.audio.onended = () => res();
		});
	}

	public readonly clone = (): Audio => {
		return new Audio(this.manager, this.audio.cloneNode() as any);
	}
}