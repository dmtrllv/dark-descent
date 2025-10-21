import type { Scene } from "../scene";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
import { Light } from "./light";
import { Material } from "./material";
import { Shader } from "./shader";
import { Sprite } from "./sprite";
import { SpriteRenderer } from "./sprite-renderer";

export class Renderer {
	private readonly canvas: HTMLCanvasElement;
	public readonly gl: GL;

	public readonly uvBuffer: WebGLBuffer;
	public readonly vertexBuffer: WebGLBuffer;

	private readonly map: RenderTarget;
	private readonly lightmap: RenderTarget;

	public constructor() {
		this.canvas = document.createElement("canvas");
		this.gl = this.canvas.getContext("webgl2")!; // TODO: check

		document.body.appendChild(this.canvas);
		this.onResize();
		window.addEventListener("resize", this.onResize);

		const gl = this.gl;

		gl.clearColor(0, 0, 0, 0);
		gl.clearDepth(10.0);
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

		this.map = new RenderTarget(this.gl, new Vec2(this.canvas.width, this.canvas.height));
		this.lightmap = new RenderTarget(this.gl, new Vec2(this.canvas.width, this.canvas.height));
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
		const cameras = scene.getComponents(Camera);

		if (cameras.length > 1) {
			console.warn("Multiple cameras are active!");
		} else if (cameras.length === 0) {
			return console.warn("Missing camera!");
		}

		const mainCamera = cameras[0]!;

		const lightMap = this.renderLights(scene, mainCamera);
		const pixels = this.renderMap(scene, mainCamera);

		this.mergeLight(lightMap, pixels);
	}

	private readonly renderMaterial = (camera: Camera, material: Material, callback: () => any) => {
		this.gl.useProgram(material.program);
		camera.useUniforms(this.gl, material);
		this.gl.uniform2fv(material.uniforms.screenResolution, [this.canvas.width, this.canvas.height]);
		callback();
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

	private renderLights = (scene: Scene, camera: Camera) => {
		const gl = this.gl;

		return this.lightmap.render(gl, () => {
			const lights = scene.getComponents(Light);

			const lightMaterial = Material.light.get();

			this.renderMaterial(camera, lightMaterial, () => {
				lights.forEach(l => {
					l.render(this, lightMaterial);
				});
			});
		});
	}

	private readonly renderMap = (scene: Scene, camera: Camera) => {
		const gl = this.gl;
		return this.map.render(gl, () => {
			const unlitSpriteMaterial = Material.unlitSprite.get();
			this.renderMaterial(camera, unlitSpriteMaterial, () => {
				scene.getComponents(SpriteRenderer)?.forEach(r => r.render(this, unlitSpriteMaterial));
			});
			this.renderShadows(scene, camera);
		});
	}

	private readonly mergeLight = (lightMap: WebGLTexture, texture: WebGLTexture) => {
		const gl = this.gl;
		gl.clearColor(0, 0, 0, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const material = Material.lightMerger.get();

		gl.useProgram(material.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.position);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
		gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.uv);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, lightMap);
		gl.uniform1i(material.uniforms.lightMap, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(material.uniforms.pixels, 1);

		gl.uniform2fv(material.uniforms.spriteSize, [this.canvas.width / 2, this.canvas.height / 2]);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	//private readonly calculateShadows = (lights: Light[], casters: ShadowCaster[]): Vec2[][] => {
	//	const v: Vec2[][] = [];

	//	for (const l of lights) {
	//		for (const c of casters) {
	//			const pos = l.transform.position;
	//			const segments = c.castingPolygon.segments;

	//			const v2 = [];

	//			for (const [a, b] of segments) {
	//				const aPrime = Vec2.sub(a, pos).normalize().scale(20).add(a);
	//				const bPrime = Vec2.sub(b, pos).normalize().scale(20).add(b);
	//				v2.push(a, aPrime, b);
	//				v2.push(aPrime, bPrime, b);
	//			}

	//			v.push(v2);
	//		}
	//	}

	//	return v;
	//}

	private renderShadows(scene: Scene, camera: Camera) {
		//const gl = this.gl;
		//const lights = scene.getComponents(Light);
		//const shadowCasters = scene.getComponents(ShadowCaster);
		//const shadowPolygons = this.calculateShadows(lights, shadowCasters);
		//const s = Material.shadow.get();
		//gl.useProgram(s.program);
		//gl.uniform2fv(s.uniforms.screenResolution, [this.canvas.width, this.canvas.height]);
		//gl.uniform1f(s.uniforms.zoom, camera.zoom);
		//gl.uniform1f(s.uniforms.ambientOcculision, camera.ambientOcculision);

		//shadowPolygons.forEach((p: Vec2[]) => {
		//	const data = new Float32Array(p.map(p => p.array).flat());

		//	const buffer = gl.createBuffer();
		//	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		//	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

		//	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		//	gl.vertexAttribPointer(s.attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		//	gl.enableVertexAttribArray(s.attributes.vertex);

		//	gl.drawArrays(gl.LINES, 0, p.length);

		//	gl.deleteBuffer(buffer);
		//});
	}
}

class RenderTarget {
	public readonly size: Vec2;
	fb: WebGLFramebuffer;
	targetTexture: WebGLTexture;

	public constructor(gl: GL, size: Vec2) {
		this.size = size;

		this.targetTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.x, this.size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);

		console.log(this.size);
	}

	public render(gl: GL, callback: () => any): WebGLTexture {
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.viewport(0, 0, this.size.x, this.size.y);

		callback();

		return this.targetTexture;
	}

}