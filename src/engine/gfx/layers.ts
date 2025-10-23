import type { RenderComponent } from "./render-component";
import { Registry } from "../registry";
import type { Light } from "./light";
import type { Renderer } from "./renderer";
import { Material } from "./material";
import type { Camera } from "./camera";

export class Layer {
	public static readonly registry = new Registry<Layer>();

	public static readonly register = (name: string) => this.registry.register(() => {
		if (this.registry.find(l => l.name === name)) {
			throw new Error(`Layer with name "${name}" already exists!`);
		}
		return new Layer(name);
	});

	public static readonly default = this.register("default");

	public readonly name: string;
	public readonly lights: Set<Light> = new Set();
	public readonly components: Set<RenderComponent> = new Set();

	public disabled: boolean = false;

	public constructor(name: string) {
		this.name = name;
	}

	public render(renderer: Renderer, camera: Camera, lightMap: WebGLTexture, sprites: WebGLTexture) {
		const material = Material.lightMerger.get();
		const gl = renderer.gl;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		material.use(gl, camera, renderer.size);

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.position);

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
		gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.uv);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, lightMap);
		gl.uniform1i(material.uniforms.lightMap, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, sprites);
		gl.uniform1i(material.uniforms.pixels, 1);

		gl.uniform2fv(material.uniforms.spriteSize, renderer.size.array);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
};