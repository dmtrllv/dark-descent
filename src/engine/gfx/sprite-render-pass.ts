import type { Camera } from "./camera";
import { Material } from "./material";
import { RenderPass } from "./render-pass";
import type { Renderer } from "./renderer";
import type { SpriteRenderer } from "./sprite-renderer";

export class SpriteRenderPass extends RenderPass<SpriteRenderer> {
	private readonly material = Material.unlitSprite.get();

	public render(renderer: Renderer, camera: Camera, sprites: SpriteRenderer[]) {
		this.target.clear(renderer.gl);

		this.material.use(renderer.gl, camera, renderer.size)
		
		const sorted = sprites.sort((a, b) => {
			return a.zIndex - b.zIndex;
		});

		sorted.forEach((l) => {
			l.render(renderer, this.material);
		});
	}
}