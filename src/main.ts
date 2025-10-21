import { Engine } from "./engine/engine";
import { FirstScene } from "./scenes";

const game = new Engine();

await game.start(FirstScene);