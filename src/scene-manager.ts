import { serialized, type ISerializable } from "./serializer";
import type { Scene } from "./scene";
import type { Game } from "./game";
import { First } from "./scenes/first";

@serialized("scene-manager")
export class SceneManager implements ISerializable<SerializeData> {
	private readonly game: Game;
	private _activeSceneName: string | null = null;
	private _activeScene: Scene | null = null;
	private _loadingScene: string | null = null;

	public get activeScene(): Scene | null {
		return this._activeScene;
	}

	public constructor(game: Game) {
		this.game = game;
	}

	public async start() {
		if (this._activeScene !== null) {
			throw new Error(`SceneManager is already initialized!`);
		}
		await this.load(First);
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

	public serialize(): SerializeData {
		return {
			scene: this._activeSceneName || First.name
		}
	}

	public parse({ scene }: SerializeData): void {
		this._activeSceneName = scene;
	}
}

type SerializeData = {
	readonly scene: string;
};

type SceneType<T> = new (game: Game) => T;