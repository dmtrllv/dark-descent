import type { Scene } from "../scene";
import type { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";
import { RenderPass } from "./render-pass";
import type { Renderer } from "./renderer";

export class LightPass extends RenderPass {
	private readonly lightMaterial = Material.light.get();

	public render(renderer: Renderer, scene: Scene, camera: Camera) {
		this.target.render(renderer.gl, () => {
			const lights = scene.getComponents(Light);

			this.renderMaterial(renderer.gl, camera, this.lightMaterial, () => {
				lights.forEach(l => l.render(renderer, this.lightMaterial));
			});
		});
	}
}