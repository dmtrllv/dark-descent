import type { Component, ComponentType } from "./component";
import type { Scene } from "./scene";
import { Transform } from "./transform";

export class GameObject {
	public readonly transform: Transform = new Transform(this);

	public readonly components: Component[] = [];

	public readonly scene: Scene;

	public constructor(scene: Scene) {
		this.scene = scene;
	}

	public readonly addComponent = <T extends Component>(type: ComponentType<T>) => {
		const component = this.scene.createComponent(type, this);
		this.components.push(component);
		return component;
	}

	public readonly getComponent = <T extends Component>(type: ComponentType<T>): T | null => {
		return (this.components.find(c => c.constructor === type) || null) as T | null;
	}
}