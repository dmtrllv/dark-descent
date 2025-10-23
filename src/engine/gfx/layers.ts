import type { RenderComponent } from "./render-component";
import { Registry } from "../registry";
import type { Light } from "./light";
import type { Renderer } from "./renderer";

export const Layers = new Registry<Layer, [Renderer]>();

export class Layer {
	public readonly name: string;
	public readonly lights: Set<Light> = new Set();
	public readonly components: Set<RenderComponent> = new Set();

	public disabled: boolean = false;

	public constructor(name: string, _renderer: Renderer) {
		this.name = name;
	}
};

export const createLayer = (name: string) => Layers.register((renderer) => {
	if (Layers.find(l => l.name === name)) {
		throw new Error(`Layer with name "${name}" already exists!`);
	}
	return new Layer(name, renderer);
});

export const layers = {
	default: createLayer("default"),
};