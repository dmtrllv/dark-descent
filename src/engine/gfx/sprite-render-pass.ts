import type { Scene } from "../scene";
import type { Camera } from "./camera";
import { Layer } from "./layer";
import { Material } from "./material";
import { RenderPass } from "./render-pass";
import type { Renderer } from "./renderer";

export class SpriteRenderPass extends RenderPass {
	private readonly material = Material.unlitSprite.get();

	public render(renderer: Renderer, _scene: Scene, camera: Camera) {
		this.target.render(renderer.gl, () => {
			this.renderMaterial(renderer.gl, camera, this.material, () => {
				Layer.registry.forEach((l) => {
					l.render(renderer, this.material);
				});
			});
		});
	}
}