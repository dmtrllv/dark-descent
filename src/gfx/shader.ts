import { Registry } from "../registry";
import type { Renderer } from "./renderer";

export class Shader {
	public static readonly registry = new Registry<Shader, [Renderer]>();

	private static readonly register = (path: string) => this.registry.register(async (renderer: Renderer) => {
		const source = await fetch(path).then(r => r.text());
		return new Shader(path, source, renderer);
	});

	public static readonly unlitSpriteVertex = this.register("/shaders/unlit-sprite.vert");
	public static readonly unlitSpriteFragment = this.register("/shaders/unlit-sprite.frag");
	public static readonly shadowVertex = this.register("/shaders/shadow.vert");
	public static readonly shadowFragment = this.register("/shaders/shadow.frag");
	
	public readonly path: string;
	public readonly attributes: Record<string, string>; 
	public readonly uniforms: Record<string, string>;
	public readonly shader: WebGLShader;

	private constructor(path: string, source: string, renderer: Renderer) {
		const isVertex = path.endsWith(".vert");

		const gl = renderer.gl;
		const shader = gl.createShader(isVertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

		if (!shader)
			throw new Error(`Could not create shader!`);

		this.path = path;
		this.shader = shader;

		gl.shaderSource(this.shader, source);
		gl.compileShader(this.shader);

		if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
			const error = gl.getShaderInfoLog(this.shader);
			gl.deleteShader(this.shader);
			throw new Error(`Could not compile shader!\n${error}`);
		}

		const { attributes, uniforms } = this.parseProperties(source, isVertex);
		this.attributes = attributes;
		this.uniforms = uniforms;
	}

	private parseProperties(source: string, isVertex: boolean): { attributes: Record<string, string>, uniforms: Record<string, string> } {
		const attributes: Record<string, string> = {};
		const uniforms: Record<string, string> = {};

		source.replaceAll(";", "\n").replaceAll("\r", "").split("\n").forEach(s => {
			const [t, type, name] = s.split(" ");
			if (isVertex && (t === "in")) {
				attributes[name] = type;
			} else if (t === "uniform") {
				uniforms[name] = type;
			}
		});

		return {
			attributes,
			uniforms
		};
	}
}