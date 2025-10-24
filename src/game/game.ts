import { Engine } from "../engine";
import { MusicPlayer } from "./music-player";
import { StartMenu } from "./scenes/game-menu";

export class Game {
	private static readonly _instance = new Game();

	public static readonly start = () => this._instance.start();

	private readonly engine: Engine;
	public readonly musicPlayer: MusicPlayer;

	public constructor() {
		this.engine = new Engine();
		this.musicPlayer = new MusicPlayer();
	}

	private async start() {
		await this.engine.start(StartMenu);
		this.musicPlayer.play();
	}
}