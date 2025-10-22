import type { Component, ComponentProps, ComponentType } from "./component";
import type { Scene } from "./scene";
import { SceneManager } from "./scene-manager";
import { Transform } from "./transform";

export class GameObject {
	public readonly transform: Transform = new Transform(this);

	public readonly components: Component[] = [];

	public readonly addComponent = <T extends Component>(type: ComponentType<T>, props?: ComponentProps<T>) => {
		const component = SceneManager.activeScene.createComponent(type, this, props);
		this.components.push(component);
		return component;
	}

	public readonly getComponent = <T extends Component>(type: ComponentType<T>): T | null => {
		return (this.components.find(c => c.constructor === type) || null) as T | null;
	}
}