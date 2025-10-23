import type { Scene } from "../scene";
import { Time } from "../time";
import { Vec2 } from "../vec";
import { Collider } from "./collider";
import { Rigidbody } from "./rigidbody";

export class Physics {
	private static readonly _instance: Physics = new Physics();

	public static readonly update = this._instance.update.bind(this._instance);

	public static readonly overlapsCircle = (center: Vec2, radius: number, point: Vec2) => {
		return Vec2.distance(center, point) <= radius;
	}

	private lastOffset = 0;

	public readonly update = (scene: Scene) => {
		const iterations = (Time.delta / Time.fixedDelta) + this.lastOffset;
		const t = iterations * Time.fixedDelta;
		this.lastOffset = Time.delta - t;

		for (let i = 0; i < iterations; i++) {
			this.run(scene);
		}
	}

	private readonly run = (scene: Scene) => {
		scene.getComponents(Rigidbody).forEach(r => r.onFixedUpdate());
		
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
