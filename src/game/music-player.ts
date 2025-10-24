import { intro, intro2, waltz } from "./songs";

let current = Math.round(Math.random() * Date.now());

const songs = [
	intro,
	intro2,
	waltz,
];

export const playMusic = () => {
	const song = songs[current % 3];
	song.get().play().then(() => {
		playMusic();
	});
	current++;
}