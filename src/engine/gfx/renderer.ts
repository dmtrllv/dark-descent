import { Registry } from "../registry";
import { Scene } from "../scene";
import { SceneManager } from "../scene-manager";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
import { Layer } from "./layers";
import { Light } from "./light";
import { LightPass } from "./light-render-pass";
import { Material } from "./material";
import { Shader } from "./shader";
import { ShadowCaster } from "./shadow-caster";
import { Sprite } from "./sprite";
import { SpriteRenderPass } from "./sprite-render-pass";
import { SpriteRenderer } from "./sprite-renderer";
import { SpriteSheet } from "./sprite-sheet";
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

	public get size(): Vec2 {
		return new Vec2(this.canvas.width, this.canvas.height);
	}

	public readonly lightPass: LightPass;
	public readonly spritePass: SpriteRenderPass;

	private constructor() {
		this.canvas = document.createElement("canvas");

		const gl = this.canvas.getContext("webgl2", {
			premultipliedAlpha: false,
			alpha: false,
		})!;

		if (!gl)
			throw new Error(`Could not get WebGL 2 context!`);

		this.gl = gl;

		document.body.appendChild(this.canvas);
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

		this.spritePass = new SpriteRenderPass(this);
		this.lightPass = new LightPass(this.gl, this.size);

		this.onResize();
	}

	public async load() {
		await Shader.registry.load(this);
		await Material.registry.load(this);
		await Sprite.registry.load(this);
		await SpriteSheet.registry.load(this);
		await Layer.registry.load();
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

		this.spritePass.resize(this.gl, newSize);
		this.lightPass.resize(this.gl, newSize);

		if (SceneManager.hasActiveScene) {
			this.render(SceneManager.activeScene);
		}
	}

	public render(scene: Scene) {
		if (SceneManager.isLoading)
			return;

		const cameras = scene.getComponents(Camera);

		if (cameras.length > 1) {
			console.warn("Multiple cameras are active!");
		} else if (cameras.length === 0) {
			return console.warn("Missing camera!");
		}

		const gl = this.gl;
		const camera = cameras[0]!;

		const allLights = scene.getComponents(Light);
		const allCasters = scene.getComponents(ShadowCaster);

		allLights.forEach(l => {
			if (l.transform.isDirty) {
				l.updateDirty(gl);
			}
		});

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		Layer.registry.forEach(l => {
			if (l.components.size === 0)
				return;

			const sprites = Array.from(l.components).filter(s => s instanceof SpriteRenderer);
			sprites.forEach(s => {
				if (s.transform.isDirty) {
					s.updateDirty(gl);
				}
			})

			const lights = allLights.filter(s => s.targetLayers === "all" || s.targetLayers.includes(l));
			const casters = allCasters.filter(s => s.targetLayers === "all" || s.targetLayers.includes(l));
			
			this.lightPass.render(this, camera, lights, casters);
			this.spritePass.render(this, camera, sprites);

			l.render(this, camera, this.lightPass.renderTarget.targetTexture, this.spritePass.renderTarget.targetTexture);
		});

		this.renderUI(camera, scene);
	}

	private renderUI(camera: Camera, scene: Scene) {
		const material = Material.unlitSprite.get();
		const gl = this.gl;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		material.use(gl, camera, this.size);
		scene.getComponents(UI).forEach(ui => {
			if (ui.transform.isDirty) {
				ui.updateDirty(gl);
			}
			ui.render(this, material);
		});
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
