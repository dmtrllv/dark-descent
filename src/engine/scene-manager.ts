import type { Scene } from "./scene";

export class SceneManager {
	private static _instance: SceneManager = new SceneManager();
	public static get hasActiveScene(): boolean {
		return this._instance._activeScene !== null;
	}

	static get activeScene() {
		const s = this._instance._activeScene;;
		if (!s)
			throw new Error(`No scene is loaded!`);
		return s;
	};

	public static readonly start = (scene: SceneType<any>) => this._instance.start(scene);
	public static readonly load = (scene: SceneType<any>) => this._instance.load(scene);

	private _activeScene: Scene | null = null;

	public get activeScene(): Scene | null {
		return this._activeScene;
	}

	private constructor() { }

	public async start(scene: SceneType<any>) {
		if (this._activeScene !== null) {
			throw new Error(`SceneManager is already initialized!`);
		}
		const s = new scene();
		this._activeScene = s;
		await s.load();
	}

	public readonly load = async <T extends Scene>(_Scene: SceneType<T>) => {
		throw new Error("TODO: load scene");
	}
}

export type SceneType<T> = new () => T;