import type { Scene } from "./scene";
import type { Engine } from "./engine";

export class SceneManager {
	private readonly game: Engine;
	private _activeScene: Scene | null = null;
	private _loadingScene: string | null = null;

	public get activeScene(): Scene | null {
		return this._activeScene;
	}

	public constructor(game: Engine) {
		this.game = game;
	}

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

		const scene = new Scene(this.game);

		await scene.load();

		this._activeScene = scene;
		this._loadingScene = null;

		scene.start();

		await this.game.emit("scene-loaded", scene);
	}
}

export type SceneType<T> = new (game: Engine) => T;