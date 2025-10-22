import type { Scene } from "./scene";

export class SceneManager {
	private static _instance: SceneManager = new SceneManager();

	static get activeScene() { return this._instance._activeScene; };
	public static readonly start = (scene: SceneType<any>) => this._instance.start(scene);
	public static readonly load = (scene: SceneType<any>) => this._instance.load(scene);

	private _activeScene: Scene | null = null;
	private _loadingScene: string | null = null;

	public get activeScene(): Scene | null {
		return this._activeScene;
	}

	private constructor() {}

	public async start(scene: SceneType<any>) {
		if (this._activeScene !== null) {
			throw new Error(`SceneManager is already initialized!`);
		}
		await this.load(scene);
	}

	public readonly load = async <T extends Scene>(Scene: SceneType<T>) => {
		if (this._loadingScene !== null)
			return

		if (this._activeScene instanceof Scene && this._activeScene !== null)
			return;

		const scene = new Scene();

		await scene.load();
		scene["_isLoaded"] = true;

		this._activeScene = scene;
		this._loadingScene = null;

		scene.start();

		//await this.game.emit("scene-loaded", scene);
	}
}

export type SceneType<T> = new () => T;