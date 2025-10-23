import { Component } from "../component";
import type { Material } from "./material";
import type { Renderer } from "./renderer";

export abstract class RenderComponent extends Component {
	public abstract render(renderer: Renderer, material: Material): void;

	public onDestroy(): void {
		super.onDestroy();
	}
}