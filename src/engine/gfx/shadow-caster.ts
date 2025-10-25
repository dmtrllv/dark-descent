import { Component } from "../component";
import { Vec2 } from "../vec";
import type { Layer } from "./layers";
import type { Light } from "./light";
import type { Material } from "./material";
import type { Renderer } from "./renderer";
import { SpriteRenderer } from "./sprite-renderer";

export class ShadowCaster extends Component {
	public targetLayers: Layer[] | "all" = "all";

	public readonly size: Vec2 = new Vec2(1, 1);

	public readonly spriteRenderer = this.getComponent(SpriteRenderer)!;

	public get points(): Vec2[] {
		const { x, y } = this.transform.position;
		return [
			new Vec2(x - this.size.x, y - this.size.y),
			new Vec2(x - this.size.x, y + this.size.y),
			new Vec2(x + this.size.x, y + this.size.y),
			new Vec2(x + this.size.x, y - this.size.y),
		]
	}

	public onStart(): void {
		if (this.spriteRenderer === null) {
			throw new Error(`No Sprite renderer provided!`);
		}
	}

	public readonly render = (renderer: Renderer, material: Material, light: Light) => {
		
	}
}