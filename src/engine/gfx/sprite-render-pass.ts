import type { Vec2 } from "../vec";
import type { Camera } from "./camera";
import { Material } from "./material";
import { RenderTarget } from "./render-target";
import type { Renderer } from "./renderer";
import type { SpriteRenderer } from "./sprite-renderer";

export class SpriteRenderPass {
	public readonly renderTarget: RenderTarget;

	public constructor(renderer: Renderer) {
		this.renderTarget = new RenderTarget(renderer.gl, renderer.size);
	}

	public readonly resize = (gl: GL, size: Vec2) => {
		this.renderTarget.resize(gl, size);
	}

	public render(renderer: Renderer, camera: Camera, sprites: SpriteRenderer[]) {
		this.renderTarget.clear(renderer.gl);

		const material = Material.unlitSprite.get();
		
		material.use(renderer.gl, camera, renderer.size)

		const sorted = sprites.sort((a, b) => {
			return a.zIndex - b.zIndex;
		});

		sorted.forEach((l) => {
			l.render(renderer, material);
		});
	}
}