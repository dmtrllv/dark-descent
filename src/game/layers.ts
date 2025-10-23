import { createLayer } from "../engine/gfx/layers";

export const layers = {
	background: createLayer("background"),
	map: createLayer("map"),
	entities: createLayer("entities"),
	foreground: createLayer("map-foreground"),
	ui: createLayer("ui"),
};