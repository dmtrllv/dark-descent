import { Engine } from "./engine/engine";
import { playMusic } from "./music-player";
import { FirstScene } from "./scenes";

const start = async () => {
	window.removeEventListener("keypress", start);
	
	startBtn.onclick = null;
	startBtn.remove();

	const game = new Engine();
	await game.start(FirstScene);
	playMusic();
}

const startBtn = document.querySelector("div")!;

startBtn.onclick = start;
window.addEventListener("keypress", start);