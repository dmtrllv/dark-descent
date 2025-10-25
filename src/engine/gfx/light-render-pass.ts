import { Vec2 } from "../vec";
import type { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";
import { RenderTarget } from "./render-target";
import type { Renderer } from "./renderer";
import type { ShadowCaster } from "./shadow-caster";

export class LightPass {
	public readonly renderTarget: RenderTarget;
	private readonly shadowTarget: RenderTarget;

	public constructor(gl: GL, size: Vec2) {
		this.renderTarget = new RenderTarget(gl, size);
		this.shadowTarget = new RenderTarget(gl, size);
	}

	public readonly resize = (gl: GL, size: Vec2) => {
		this.renderTarget.resize(gl, size);
		this.shadowTarget.resize(gl, size);
	}

	public render(renderer: Renderer, camera: Camera, lights: Light[], casters: ShadowCaster[]) {
		const lightMaterial = Material.light.get();
		const shadowMaterial = Material.shadow.get();

		const gl = renderer.gl;
		this.renderTarget.clear(gl);
		lights.forEach(l => {
			const lightPost = l.transform.position;

			this.shadowTarget.clear(gl);
			// get casters within radius
			const filtered = casters.filter(c => !!c.points.find(p => Vec2.distance(p, lightPost)))
			
			// sort casters from far to close by
			const sorted = filtered.sort((a, b) => {
				return Vec2.distance(b.transform.position, lightPost) - Vec2.distance(a.transform.position, lightPost);
			});
			
			shadowMaterial.use(renderer.gl, camera, renderer.size);
			// for each caster
			sorted.forEach(caster => {
				// -> render the shadow except where the sprite alpha != 0
				caster.render(renderer, shadowMaterial, l);
			});

			// render the light with the generated shadow texture
			this.renderTarget.bind(gl);
			lightMaterial.use(gl, camera, renderer.size);
			l.render(renderer, lightMaterial);
		});
	}
}