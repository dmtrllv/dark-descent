import { Registry } from "../registry";
import { Scene } from "../scene";
import { SceneManager } from "../scene-manager";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
//import { Layer } from "./layer";
import { LightPass } from "./light-render-pass";
import { Material } from "./material";
import { renderMergedPasses } from "./merge-pass";
import type { RenderPass } from "./render-pass";
import { Shader } from "./shader";
import { Sprite } from "./sprite";
import { SpriteRenderPass } from "./sprite-render-pass";
import { UI } from "./ui";

export class Renderer {
	private static readonly _instance = new Renderer();
	public static readonly load = this._instance.load.bind(this._instance);
	public static readonly render = this._instance.render.bind(this._instance);
	public static readonly createArrayBuffer = this._instance.createArrayBuffer.bind(this._instance);

	private readonly canvas: HTMLCanvasElement;
	public readonly gl: GL;

	public readonly uvBuffer: WebGLBuffer;
	public readonly vertexBuffer: WebGLBuffer;

	private constructor() {
		this.canvas = document.createElement("canvas");
		const gl = this.canvas.getContext("webgl2")!;
		if (!gl)
			throw new Error(`Could not get WebGL 2 context!`);
		this.gl = gl;

		document.body.appendChild(this.canvas);
		this.onResize();
		window.addEventListener("resize", this.onResize);

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
		//await Layer.registry.load();
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

		if(SceneManager.hasActiveScene) {
			this.render(SceneManager.activeScene);
		}
	}

	public render(scene: Scene) {
		if(SceneManager.isLoading)
			return;
		
		const cameras = scene.getComponents(Camera);

		if (cameras.length > 1) {
			console.warn("Multiple cameras are active!");
		} else if (cameras.length === 0) {
			return console.warn("Missing camera!");
		}

		const camera = cameras[0]!;

		const lp = this.lightPass.get();
		const sp = this.spritePass.get();

		lp.render(this, scene, camera);
		sp.render(this, scene, camera);

		renderMergedPasses(this, this.size, lp.target.targetTexture, sp.target.targetTexture);

		this.renderUI(camera, scene);
	}

	private renderUI(camera: Camera, scene: Scene) {
		const material = Material.unlitSprite.get();
		const gl = this.gl;

		gl.useProgram(material.program);
		camera.useUniforms(gl, material);
		gl.uniform2fv(material.uniforms.screenResolution, [this.canvas.width, this.canvas.height]);
		
		scene.getComponents(UI).forEach(ui => ui.render(this, material));
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
