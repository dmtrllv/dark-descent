import { Layers } from "./layers";
import type { Scene } from "../scene";
import type { Camera } from "./camera";
import { Material } from "./material";
import { RenderPass } from "./render-pass";
import type { Renderer } from "./renderer";

export class SpriteRenderPass extends RenderPass {
	private readonly material = Material.unlitSprite.get();

	public render(renderer: Renderer, _scene: Scene, camera: Camera) {
		this.target.render(renderer.gl, () => {
			this.renderMaterial(renderer.gl, camera, this.material, () => {
				Layers.forEach(l => {
					if (l.disabled)
						return;

					const sorted = Array.from(l.components).sort((a, b) => {
						return a.zIndex - b.zIndex;
					});

					sorted.forEach((l) => {
						l.render(renderer, this.material);
					});
				});
			});
		});
	}
}