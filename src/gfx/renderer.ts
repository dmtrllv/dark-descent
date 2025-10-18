import type { Scene } from "../scene";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";
import { Shader } from "./shader";
import { ShadowCaster } from "./shadow-caster";
import { Sprite } from "./sprite";
import { SpriteRenderer } from "./sprite-renderer";

export class Renderer {
	private readonly canvas: HTMLCanvasElement;
	public readonly gl: GL;

	public readonly uvBuffer: WebGLBuffer;
	public readonly vertexBuffer: WebGLBuffer;

	public constructor() {
		this.canvas = document.createElement("canvas");
		this.gl = this.canvas.getContext("webgl2")!; // TODO: check

		document.body.appendChild(this.canvas);
		this.onResize();
		window.addEventListener("resize", this.onResize);

		const gl = this.gl;

		gl.clearColor(0.25, 0.25, 0.25, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		this.uvBuffer = this.createArrayBuffer([
			0, 1,
			0, 0,
			1, 0,
			0, 1,
			1, 0,
			1, 1,
		]);

		this.vertexBuffer = this.createArrayBuffer([
			-1.0, -1.0,
			-1.0, 1.0,
			1.0, 1.0,
			-1.0, -1.0,
			1.0, 1.0,
			1.0, -1.0
		]);
	}

	public async load() {
		await Shader.registry.load(this);
		await Material.registry.load(this);
		await Sprite.registry.load(this);
	}

	private readonly onResize = () => {
		const c = this.canvas;
		const s = c.style;
		const w = window.innerWidth;
		const h = window.innerHeight;
		s.width = (c.width = w) + "px";
		s.height = (c.height = h) + "px";

		this.gl.viewport(0, 0, w, h);
	}

	public render(scene: Scene, _delta: number) {
		const gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const cameras = scene.getComponents(Camera);

		if (cameras.length > 1) {
			console.warn("Multiple cameras are active!");
		} else if (cameras.length === 0) {
			return console.warn("Missing camera!");
		}

		const mainCamera = cameras[0]!;

		const lights = scene.getComponents(Light);
		const shadowCasters = scene.getComponents(ShadowCaster);
		const shadowPolygons = this.calculateShadows(lights, shadowCasters);

		const s = Material.shadow.get();
		gl.useProgram(s.program);
		gl.uniform2fv(s.uniforms.screenResolution, [this.canvas.width, this.canvas.height]);
		gl.uniform1f(s.uniforms.zoom, mainCamera.zoom);
		gl.uniform1f(s.uniforms.ambientOcculision, mainCamera.ambientOcculision);
		
		shadowPolygons.forEach((p: Vec2[]) => {
			const data = new Float32Array(p.map(p => p.array).flat());

			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(s.attributes.vertex, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(s.attributes.vertex);

			gl.drawArrays(gl.TRIANGLES, 0, p.length);

			gl.deleteBuffer(buffer);
		});


		const unlitSpriteMaterial = Material.unlitSprite.get();
		gl.useProgram(unlitSpriteMaterial.program);
		gl.uniform2fv(unlitSpriteMaterial.uniforms.screenResolution, [this.canvas.width, this.canvas.height]);
		gl.uniform1f(unlitSpriteMaterial.uniforms.zoom, mainCamera.zoom);
		gl.uniform1f(unlitSpriteMaterial.uniforms.ambientOcculision, mainCamera.ambientOcculision);
		scene.getComponents(SpriteRenderer)?.forEach(r => r.render(this, unlitSpriteMaterial));
	}

	public createArrayBuffer(data: number[]) {
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
		return buffer;
	}

	public createIndexBuffer(data: number[]) {
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW);
		return buffer;
	}

	private readonly calculateShadows = (lights: Light[], casters: ShadowCaster[]): Vec2[][] => {
		const v: Vec2[][] = [];

		for (const l of lights) {
			for (const c of casters) {
				const pos = l.transform.position;
				const segments = c.castingPolygon.segments;

				const v2 = [];

				for(const [a, b] of segments) {
					const aPrime = Vec2.sub(a, pos).normalize().scale(20).add(a);
					const bPrime = Vec2.sub(b, pos).normalize().scale(20).add(b);
					v2.push(a, aPrime, b);
					v2.push(aPrime, bPrime, b);
				}

				v.push(v2);
			}
		}

		return v;
	}
}