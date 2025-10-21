import { Engine } from "./engine/engine";
import { FirstScene } from "./scenes";

const startBtn = document.querySelector("div")!;

startBtn.onclick = async () => {
	startBtn.onclick = null;
	startBtn.remove();

	const game = new Engine();
	await game.start(FirstScene);
}
