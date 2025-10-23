import { Registry, RegistryItem } from "../registry";
import type { Vec2 } from "../vec";
import type { Camera } from "./camera";
import type { Renderer } from "./renderer";
import { Shader } from "./shader";

export class Material {
	public static readonly registry = new Registry<Material, [Renderer]>();

	private static readonly register = (vertex: RegistryItem<Shader>, fragment: RegistryItem<Shader>) => {
		return this.registry.register((renderer) => new Material(renderer, vertex.get(), fragment.get()));
	}

	public static readonly unlitSprite = this.register(Shader.unlitSpriteVertex, Shader.unlitSpriteFragment);
	public static readonly shadow = this.register(Shader.shadowVertex, Shader.shadowFragment);
	public static readonly light = this.register(Shader.lightVertex, Shader.lightFragment);
	public static readonly lightMerger = this.register(Shader.lightMergerVertex, Shader.lightMergerFragment);

	public readonly attributes: Record<string, number> = {};
	public readonly uniforms: Record<string, WebGLUniformLocation> = {};

	public readonly program: WebGLProgram;

	public constructor(renderer: Renderer, vertex: Shader, fragment: Shader) {
		const gl = renderer.gl;
		this.program = gl.createProgram();
		gl.attachShader(this.program, vertex.shader);
		gl.attachShader(this.program, fragment.shader);
		gl.linkProgram(this.program);

		Object.keys(vertex.attributes).forEach(name => {
			const loc = gl.getAttribLocation(this.program, name);
			if (loc <= -1)
				return console.warn(`Could not get attributes location for ${name} at ${vertex.path}!`);
			this.attributes[name] = loc;
		});

		const uniforms = [...Object.keys(vertex.uniforms), ...Object.keys(fragment.uniforms)]
		uniforms.forEach(name => {
			const loc = gl.getUniformLocation(this.program, name);
			if (!loc)
				return console.warn(`Could not get attributes location for ${name} at ${vertex.path} or ${fragment.path}!`);
			this.uniforms[name] = loc;
		});
	}

	public use = (gl: GL, camera: Camera, size: Vec2) => {
		gl.useProgram(this.program);
		camera.useUniforms(gl, this);
		gl.uniform2fv(this.uniforms.screenResolution, [size.x, size.y]);
	}
}