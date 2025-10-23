import type { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";
import { RenderPass } from "./render-pass";
import type { Renderer } from "./renderer";

export class LightPass extends RenderPass<Light> {
	private readonly lightMaterial = Material.light.get();

	public render(renderer: Renderer, camera: Camera, lights: Light[]) {
		this.target.clear(renderer.gl);
		this.lightMaterial.use(renderer.gl, camera, renderer.size);
		lights.forEach(l => l.render(renderer, this.lightMaterial));
	}
}