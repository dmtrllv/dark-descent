import type { Component, ComponentType } from "./component";
import { GameObject } from "./game-object";
import type { Vec2 } from "./vec";

export abstract class Scene {
	private readonly gameObjects: GameObject[] = [];

	public readonly components: Map<ComponentType<any>, Component[]> = new Map();

	private _isLoaded: boolean = false;

	public constructor() {}

	public readonly getComponents = <T extends Component>(type: ComponentType<T>): T[] => {
		return (this.components.get(type) || []) as T[];
	}

	public readonly load = async () => {
		await this.onLoad();
		this._isLoaded = true;
	}

	public async onLoad() {}
	
	public async start() {
		for(const [_, c] of this.components) {
			c.forEach(c => c.start());
		}
	}
	
	public async stop() { }

	public spawn<T extends GameObject, Args extends any[]>(gameObject: new (scene: Scene, ...args: Args) => T, ...args: Args): GameObject;
	public spawn(position?: Vec2): GameObject;
	public spawn(a?: any, ...args: any[]): GameObject {
		if (a && (a.prototype instanceof GameObject)) {
			const obj = new a(this, ...args);
			this.gameObjects.push(obj);
			return obj;
		} else {
			const obj = new GameObject(this);
			this.gameObjects.push(obj);

			if (a !== undefined)
				obj.transform.position = a;

			return obj;
		}
	}

	public createComponent<T extends Component>(type: ComponentType<T>, gameObject: GameObject) {
		if (!this.components.has(type)) {
			this.components.set(type, []);
		}
		const component = new type(gameObject);
		component.init();
		this.components.get(type)?.push(component);
		if(this._isLoaded)
			component.start();
		return component;
	}

	public update(delta: number) {
		this.gameObjects.forEach(g => g.components.forEach(c => c.update(delta)));
	}
	
}