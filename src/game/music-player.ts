import type { Audio, RegistryItem } from "../engine";
import { random } from "../utils";
import { intro, intro2, waltz } from "./songs";

let current = Math.round(Math.random() * Date.now());

const songs = [
	intro,
	intro2,
	waltz,
];

export const playMusic = () => {

}

// define intervals as random(min seconds, max seconds)
const PLAY_INTERVALS = {
	"constant": [0, 0],
	"frequent": [60, 5 * 60],
	"rarely": [30 * 60, 60 * 60],
	"never": null
} as const;

export class MusicPlayer {
	private _current: RegistryItem<Audio> | null = null;
	private _shouldPlay: boolean = true;
	private _timeout: number | null = null;

	public playInterval: keyof typeof PLAY_INTERVALS = "frequent";

	public constructor() { }

	public readonly play = () => {
		if (this._current)
			return;
		this._shouldPlay = true;
		this._current = songs[current % songs.length];
		this.playSong();
	}

	private readonly playSong = () => {
		if (this._current === null)
			return;

		this._current.get().play().then(() => {
			if (this._shouldPlay) {
				const interval = PLAY_INTERVALS[this.playInterval];
				if (interval === null)
					return;
				this._timeout = setTimeout(() => {
					current++;
					this._current = songs[current % songs.length];
					this.playSong();
				}, random(interval[0], interval[1]));
			}
		});
	}

	public readonly stop = () => {
		if (this._timeout !== null) {
			clearInterval(this._timeout);
			this._timeout = null;
		}
		this._current = null;
	}
}