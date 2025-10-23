import { Animation } from "../engine";

import { fire1, fire2, fire3, fire4, fire5, fire6 } from "./sprites"; 

export const fireAnimation = Animation.registry.register(() => new Animation(100, [
	fire1.get(),
	fire2.get(),
	fire3.get(),
	fire4.get(),
	fire5.get(),
	fire6.get(),
]));