import type { Component, ComponentProps, ComponentType } from "./component";
import type { BoxCollider } from "./physics";
import { SceneManager } from "./scene-manager";
import { Transform } from "./transform";

export class GameObject {
	public tag: string = "Default";

	public readonly transform: Transform = new Transform(this);

	public components: Component[] = [];

	public readonly addComponent = <T extends Component>(type: ComponentType<T>, props?: ComponentProps<T>) => {
		const component = SceneManager.activeScene.addComponent(type, this, props);
		this.components.push(component);
		return component;
	}

	public readonly getComponent = <T extends Component>(type: ComponentType<T>): T | null => {
		return (this.components.find(c => c.constructor === type) || null) as T | null;
	}

	public readonly removeComponent = (component: Component) => {
		const index = this.components.indexOf(component);
		if (index > -1)
			this.components.splice(index, 1);
	}

	public readonly destroy = () => {
		SceneManager.activeScene.removeGameObject(this);
	}

	public onCollision(col: BoxCollider) {
		this.components.forEach(c => c.onCollision(col));
	}
	public onCollisionLeave(col: BoxCollider) {
		this.components.forEach(c => c.onCollisionLeave(col));
	}
}