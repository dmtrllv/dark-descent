import type { Audio, RegistryItem } from "../engine";
import { intro, intro2, waltz } from "./songs";

let current = Math.round(Math.random() * Date.now());

const songs = [
	intro,
	intro2,
	waltz,
];

export const playMusic = () => {

}

export class MusicPlayer {
	private _current: RegistryItem<Audio> | null = null;
	private _shouldPlay: boolean = false;

	public constructor() {

	}

	public readonly play = () => {
		this._shouldPlay = true;
		this._current = songs[current % 3];
		this._current.get().play().then(() => {
			if (this._shouldPlay)
				playMusic();
		});
		current++;
	}

	public readonly stop = () => {
		//this._current.get().
	}
}