import { Component } from "../component";
import { Layer } from "./layers";
import type { Material } from "./material";
import type { Renderer } from "./renderer";

export abstract class RenderComponent extends Component {
	public zIndex: number = 0;
	
	private _layer: Layer = Layer.default.get();

	public get layer() { return this._layer; }

	public set layer(layer: Layer) {
		this._layer = layer;
	}

	public onInit(): void {
		this._layer.components.add(this);
	}


	public abstract render(renderer: Renderer, material: Material): void;

	public onDestroy(): void {
		super.onDestroy();
		this._layer.components.delete(this);
	}
}