import type { Scene } from "./scene";

export class SceneManager {
	private static _instance: SceneManager = new SceneManager();
	public static get hasActiveScene(): boolean {
		return this._instance._activeScene !== null;
	}

	public static get isLoading() { return this._instance._isLoading; }
	
	public static get activeScene() {
		const s = this._instance._activeScene;;
		if (!s)
			throw new Error(`No scene is loaded!`);
		return s;
	};
	
	public static readonly start = (scene: SceneType<any>) => this._instance.start(scene);
	public static readonly load = (scene: SceneType<any>) => this._instance.load(scene);
	
	private _isLoading: boolean = false;
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

	public readonly load = async <T extends Scene>(type: SceneType<T>) => {
		if (this._activeScene instanceof type) {
			return;
		}

		if(this._isLoading)
			return;

		this._isLoading = true;

		if(this._activeScene) {
			this._activeScene.unload();
		}

		const s = new type();
		this._activeScene = s;
		await s.load();

		this._isLoading = false;
	}
}

export type SceneType<T> = new () => T;