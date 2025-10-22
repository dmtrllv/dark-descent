import type { GameObject } from "./game-object";
import type { Transform } from "./transform";

export abstract class Component {
	public readonly gameObject: GameObject;
	public get transform(): Transform { return this.gameObject.transform; }
	
	public readonly getComponent: <T extends Component>(type: ComponentType<T>) => T | null;
	public readonly addComponent: <T extends Component>(type: ComponentType<T>) => T;
	
	public constructor(gameObject: GameObject) {
		this.gameObject = gameObject;
		this.getComponent = this.gameObject.getComponent;
		this.addComponent = this.gameObject.addComponent;
	}

	public init() {}
	public start() {}
	public update() {}
}

export type ComponentType<T extends Component> = new (gameObject: GameObject) => T;