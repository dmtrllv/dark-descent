import type { Scene } from "../scene";
import { Collider } from "./collider";

export class Physics {
	private static readonly _instance: Physics = new Physics();

	public static readonly update = this._instance.update.bind(this._instance);

	public readonly update = (scene: Scene) => {
		const colliders = scene.getComponentsOfKind(Collider);
		const collisions: [Collider, Collider][] = [];
		for (let i = 0; i < colliders.length; i++) {
			const a = colliders[i]!;
			for (let j = i + 1; j < colliders.length; j++) {
				const b = colliders[j]!;
				if (a.collidesWith(b)) {
					collisions.push([a, b]);
				}
			}
		}

		const emitCollision = (a: Collider, b: Collider) => {
			a.gameObject.components.forEach(c => c.onCollision(b));
		};

		collisions.forEach(([a, b]) => {
			emitCollision(a, b);
			emitCollision(b, a);
		});
	}
}
