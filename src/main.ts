import { Game } from "./game/game";

const start = async () => {
	const startText = document.querySelector("div")!;
	
	startText.onclick = null;
	
	window.removeEventListener("click", start);
	window.removeEventListener("keypress", start);

	let count = 0;
	const interval = setInterval(() => {
		const points = new Array((count++ % 4)).fill(".").join("");
		startText.innerText = `Loading${points}`;
	}, 350);

	startText.innerText = `Loading`;

	await new Promise<void>(res => setInterval(() => {
		res()
	}, 1));

	await Game.start();

	clearInterval(interval);
	startText.remove();
}

window.addEventListener("click", start);
window.addEventListener("keypress", start);
