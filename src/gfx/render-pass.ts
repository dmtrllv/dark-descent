import type { Scene } from "../scene";
import type { Vec2 } from "../vec";
import type { Camera } from "./camera";
import type { Material } from "./material";
import { RenderTarget } from "./render-target";
import type { Renderer } from "./renderer";

export abstract class RenderPass {
	public readonly target: RenderTarget;

	public constructor(target: RenderTarget);
	public constructor(gl: GL, size: Vec2);
	public constructor(arg: GL | RenderTarget, size?: Vec2) {
		if(arg instanceof RenderTarget) {
			this.target = arg;
		} else {
			this.target = new RenderTarget(arg, size!);
		}
	}

	protected readonly renderMaterial = (gl: GL, camera: Camera, material: Material, callback: () => any) => {
		gl.useProgram(material.program);
		camera.useUniforms(gl, material);
		gl.uniform2fv(material.uniforms.screenResolution, [this.target.size.x, this.target.size.y]);
		callback();
	}

	public abstract render(renderer: Renderer, scene: Scene, camera: Camera, delta: number): void;
}