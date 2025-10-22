import { Registry } from "../registry";
import type { Material } from "./material";
import type { RenderComponent } from "./render-component";
import type { Renderer } from "./renderer";

export class Layer {
	public readonly name: string;

	private _renderComponents: RenderComponent[] = [];

	public constructor(name: string) {
		this.name = name;
	}

	public readonly add = (component: RenderComponent) => {
		this._renderComponents.push(component);
	}

	public readonly remove = (component: RenderComponent) => {
		const index = this._renderComponents.indexOf(component);
		if (index > -1) {
			this._renderComponents.splice(index, 1);
		}
	}

	public readonly move = (component: RenderComponent, newLayer: Layer) => {
		this.remove(component);
		newLayer.add(component);
	}

	public readonly render = (renderer: Renderer, material: Material) => {
		this._renderComponents.forEach(c => c.render(renderer, material));
	}

	public static registry = new Registry<Layer>();

	private static readonly register = (name: string) => this.registry.register(() => new Layer(name));

	public static readonly default = this.register("Default");
	public static readonly background = this.register("Background");
	public static readonly mobs = this.register("Mobs");
	public static readonly player = this.register("Player");
	public static readonly map = this.register("Map");
}