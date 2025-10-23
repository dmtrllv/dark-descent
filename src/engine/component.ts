import type { GameObject } from "./game-object";
import type { Collider } from "./physics";
import type { Transform } from "./transform";

export abstract class Component {
	public readonly gameObject: GameObject;
	public get transform(): Transform { return this.gameObject.transform; }

	public readonly getComponent: <T extends Component>(type: ComponentType<T>) => T | null;
	public readonly addComponent: <T extends Component>(type: ComponentType<T>, props?: ComponentProps<T>) => T;

	public constructor(gameObject: GameObject) {
		this.gameObject = gameObject;
		this.getComponent = this.gameObject.getComponent.bind(this.gameObject);
		this.addComponent = this.gameObject.addComponent.bind(this.gameObject);
	}

	public onInit() { }
	public onStart() { }
	public onUpdate() { }

	public onCollision(_col: Collider) {}
	
	public onDestroy(): void {}
}

export type ComponentType<T extends Component> = new (gameObject: GameObject) => T;

export type ComponentProps<T extends Component> = {
	readonly [K in Exclude<keyof T, keyof Component>]?: T[K]
};