import { Animation } from "./animation";
import { AudioManager } from "./audio-manager";
import { Renderer } from "./gfx/renderer";
import { Input } from "./input";
import { Physics } from "./physics";
import type { Scene } from "./scene";
import { SceneManager, type SceneType } from "./scene-manager";
import { Time } from "./time";

export class Engine {
	private readonly eventListeners: EventListeners = {};

	private _animationFrame: number | null = null;

	private _isActive = true;

	public constructor() {
		window.addEventListener("blur", this.onInactive);
		window.addEventListener("focus", this.onActive);
	}

	private readonly onActive = () => {
		this.resume();
		this._isActive = true;
	}
	
	private readonly onInactive = () => {
		this.stop();
		this._isActive = false;
	}

	public async start(scene: SceneType<any>) {
		await AudioManager.load();
		await Renderer.load();
		await Animation.registry.load();
		await SceneManager.start(scene);
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

	public readonly tick = () => {
		if (!this._isActive)
			return;

		const scene = SceneManager.activeScene;
		if (scene) {
			Time.tick();
			scene.update();
			Physics.update(scene);
			AudioManager.tick(scene);
			Renderer.render(scene);
			Input.tick();
		}

		this._animationFrame = requestAnimationFrame(this.tick.bind(this));
	}

	private readonly resume = () => {
		if (this._animationFrame === null) {
			this._animationFrame = requestAnimationFrame(this.tick.bind(this));
			Time.resume();
		}
	}

	public readonly stop = () => {
		if (this._animationFrame !== null) {
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