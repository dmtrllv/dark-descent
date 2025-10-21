import { Renderer } from "./gfx/renderer";
import type { Scene } from "./scene";
import { SceneManager } from "./scene-manager";

export class Game {
	private readonly eventListeners: EventListeners = {};

	public readonly renderer: Renderer;
	public readonly sceneManager: SceneManager;

	private _totalTicks = 0;
	private _lastTick = 0;
	private _animationFrame: number | null = null;

	private _active = true;

	public constructor() {
		this.renderer = new Renderer();
		this.sceneManager = new SceneManager(this);
	}

	public async start() {
		await this.renderer.load();
		await this.sceneManager.start();
		this.resume();
	}

	public readonly on = <K extends keyof Events>(event: K, listener: (...args: Events[K]) => any) => {
		if (!this.eventListeners[event])
			this.eventListeners[event] = [];
		this.eventListeners[event].push(listener);
	}

	public readonly emit = async <K extends keyof Events>(event: K, ...args: Events[K]) => {
		const listeners = (this.eventListeners[event] || []) as any[];
		await Promise.all(listeners.map(l => l(...args)));
	}

	public readonly tick = (time: number) => {
		const delta = time - this._lastTick;
		this._lastTick = time;

		this._totalTicks++;
		const d = delta / 1000;

		const scene = this.sceneManager.activeScene;
		if (scene) {
			if (this._active)
				scene.update(d);
			this.renderer.render(scene, d);
		}

		this._animationFrame = requestAnimationFrame(this.tick);
	}

	private readonly resume = () => {
		if (this._animationFrame === null)
			this._animationFrame = requestAnimationFrame(this.tick);
	}

	public readonly stop = () => {
		if (this._animationFrame) {
			cancelAnimationFrame(this._animationFrame);
			this._animationFrame = null;
		}
	}
}

export type Events = {
	readonly "scene-loaded": [Scene];
}

type EventListeners = {
	[K in keyof Events]?: ((...args: Events[K]) => any)[];
}