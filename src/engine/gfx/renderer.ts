import { Registry } from "../registry";
import type { Scene } from "../scene";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
import { Layer } from "./layer";
import { LightPass } from "./light-render-pass";
import { Material } from "./material";
import { renderMergedPasses } from "./merge-pass";
import type { RenderPass } from "./render-pass";
import { Shader } from "./shader";
import { Sprite } from "./sprite";
import { SpriteRenderPass } from "./sprite-render-pass";

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

		gl.clearColor(0, 0, 0, 0);

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

	private readonly passRegistry = new Registry<RenderPass>();

	public get size(): Vec2 {
		return new Vec2(this.canvas.width, this.canvas.height);
	}

	public readonly lightPass = this.passRegistry.register(() => new LightPass(this.gl, this.size));
	public readonly spritePass = this.passRegistry.register(() => new SpriteRenderPass(this.gl, this.size));

	public async load() {
		await Shader.registry.load(this);
		await Material.registry.load(this);
		await Sprite.registry.load(this);
		await Layer.registry.load();
		await this.passRegistry.load();
	}

	private readonly onResize = () => {
		const c = this.canvas;
		const s = c.style;
		const w = window.innerWidth;
		const h = window.innerHeight;
		s.width = (c.width = w) + "px";
		s.height = (c.height = h) + "px";

		this.gl.viewport(0, 0, w, h);

		const newSize = this.size;

		if (this.passRegistry.isLoaded) {
			this.passRegistry.forEach((item) => {
				item.target.resize(this.gl, newSize);
			});
		}
	}

	public render(scene: Scene, delta: number) {
		const cameras = scene.getComponents(Camera);

		if (cameras.length > 1) {
			console.warn("Multiple cameras are active!");
		} else if (cameras.length === 0) {
			return console.warn("Missing camera!");
		}

		const camera = cameras[0]!;

		const lp = this.lightPass.get();
		const sp = this.spritePass.get();

		lp.render(this, scene, camera, delta);
		sp.render(this, scene, camera, delta);

		renderMergedPasses(this, this.size, lp.target.targetTexture, sp.target.targetTexture);
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
}
