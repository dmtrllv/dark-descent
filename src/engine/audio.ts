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
		return new Promise<Audio>((res, rej) => {
			const a = new Audio(manager, path);
			a.audio.addEventListener("canplaythrough", () => {
				res(a);
			});
			a.audio.onerror = () => {
				rej(new Error(`Could not load ${path}!`));
			};
		});
	});

	public readonly play = (): Promise<void> => {
		this.manager.play(this, true);
		return new Promise((res) => {
			this.audio.onended = () => res();
		});
	}

	public readonly repeat = (startOffset: number = 0, endOffset: number = 0): Promise<void> => {
		this.manager.play(this, false, startOffset, endOffset);
		return new Promise((res) => {
			this.audio.onended = () => res();
		});
	}

	public readonly clone = (): Audio => {
		return new Audio(this.manager, this.audio.cloneNode() as any);
	}
}