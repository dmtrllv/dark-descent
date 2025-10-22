import { intro, intro2 } from "./songs";

let current = 0;

const songs = [
	intro,
	intro2,
]

export const playMusic = () => {
	const song = songs[current % songs.length];
	song.get().play().then(() => {
		playMusic();
	});
	current++;
}