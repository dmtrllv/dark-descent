import type { Sprite } from "./gfx";
import { Registry } from "./registry";

export class Animation {
	public static readonly  registry = new Registry<Animation>()
	
	public readonly keyframes: Keyframe[];
	public readonly speed: number;
	
	public constructor(speed: number, keyframes: Keyframe[]) {
		this.speed = speed;
		this.keyframes = keyframes;
	}
};

export type Keyframe = Sprite;