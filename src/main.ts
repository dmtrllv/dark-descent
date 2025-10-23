import { Engine } from "./engine/engine";
import { playMusic } from "./music-player";
import { StartMenu } from "./scenes/game-menu";

const start = async () => {
	window.removeEventListener("keypress", start);
	
	startBtn.onclick = null;
	startBtn.remove();

	const game = new Engine();
	await game.start(StartMenu);
	playMusic();
}

const startBtn = document.querySelector("div")!;

startBtn.onclick = start;
window.addEventListener("keypress", start);
