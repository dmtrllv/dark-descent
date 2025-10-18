import type { Game } from "./game";
import type { GameObject } from "./game-object";
import type { Transform } from "./transform";

export abstract class Component {
	public readonly gameObject: GameObject;
	public get transform(): Transform { return this.gameObject.transform; }
	
	public constructor(gameObject: GameObject) {
		this.gameObject = gameObject;
	}

	public init(_game: Game) {}
	public start() {}
	public update(_delta: number) {}
}

export type ComponentType<T extends Component> = new (gameObject: GameObject) => T;