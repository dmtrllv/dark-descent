import { Animation } from "../engine";

import { fire1, fire2, fire3, fire4, fire5, fire6 } from "./sprites"; 
import { player, playerWalking } from "./sprites/character";

export const fireAnimation = Animation.registry.register(() => new Animation(100, [
	fire1.get(),
	fire2.get(),
	fire3.get(),
	fire4.get(),
	fire5.get(),
	fire6.get(),
]));

export const playerAnimation = Animation.registry.register(() => new Animation(250, player.get().sprites));
export const playerWalkingAnimation = Animation.registry.register(() => new Animation(230, playerWalking.get().sprites));