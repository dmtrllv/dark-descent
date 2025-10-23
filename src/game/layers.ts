import { Layer } from "../engine/gfx/layers";

export const layers = {
	background: Layer.register("background"),
	map: Layer.register("map"),
	entities: Layer.register("entities"),
	foreground: Layer.register("foreground"),
};