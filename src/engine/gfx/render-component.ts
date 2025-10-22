import { Component } from "../component";
import { Layer } from "./layer";
import type { Material } from "./material";
import type { Renderer } from "./renderer";

export abstract class RenderComponent extends Component {
	private _layer = (() => {
		const l = Layer.default.get();
		l.add(this);
		return l;
	})();

	public get layer() {
		return this._layer;
	}

	public set layer(layer: Layer) {
		this._layer.move(this, layer);
	}

	public abstract render(renderer: Renderer, material: Material): void;
}