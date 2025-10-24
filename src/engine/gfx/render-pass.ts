import type { Component } from "../component";
import type { Vec2 } from "../vec";
import type { Camera } from "./camera";
import { RenderTarget } from "./render-target";
import type { Renderer } from "./renderer";

export abstract class RenderPass<T extends Component> {
	public readonly target: RenderTarget;

	public constructor(target: RenderTarget);
	public constructor(gl: GL, size: Vec2);
	public constructor(arg: GL | RenderTarget, size?: Vec2) {
		if (arg instanceof RenderTarget) {
			this.target = arg;
		} else {
			this.target = new RenderTarget(arg, size!);
		}
	}

	public clear(gl: GL) {
		this.target.clear(gl);
	}

	public abstract render(renderer: Renderer, camera: Camera, components: T[]): void;
}