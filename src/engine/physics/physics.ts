import { split } from "../../utils";
import type { Scene } from "../scene";
import { Vec2 } from "../vec";
import { BoxCollider } from "./box-collider";
import { Rigidbody } from "./rigidbody";

export class Physics {
	private static readonly _instance: Physics = new Physics();

	public static readonly update = this._instance.update.bind(this._instance);

	public static readonly overlapsCircle = (center: Vec2, radius: number, point: Vec2) => {
		return Vec2.distance(center, point) <= radius;
	}

	private _prevDynamicColliders: BoxCollider[] = [];
	private _prevCollisions: BoxCollider[][] = [];

	public readonly update = (scene: Scene) => {
		const boxColliders = scene.getComponentsOfKind(BoxCollider);
		boxColliders.forEach(c => c.updateDirty());
		const [dynamic, colliders] = split(boxColliders, item => !!item.getComponent(Rigidbody));

		const collisions = this.checkCollisions(dynamic, colliders);

		this._prevDynamicColliders.forEach((d, index) => {
			const i = dynamic.indexOf(d);
			if (i === -1) {
				this._prevCollisions[i]?.forEach(c => {
					c.gameObject.onCollisionLeave(d);
					d.gameObject.onCollisionLeave(c);
				});
				return;
			}

			const checks = collisions[i]!;

			this._prevCollisions[index].forEach(col => {
				if (!checks.includes(col)) {
					d.gameObject.onCollisionLeave(col);
					col.gameObject.onCollisionLeave(d);
				}
			});
		});

		this._prevCollisions = collisions;
		this._prevDynamicColliders = dynamic;

		dynamic.forEach((d, i) => {
			collisions[i]!.forEach(col => {
				d.gameObject.onCollision(col);
				col.gameObject.onCollision(d);
			});
		});
	}
	private checkCollisions(dynamic: BoxCollider[], colliders: BoxCollider[]): BoxCollider[][] {
		const collisions: BoxCollider[][] = dynamic.map(() => []);
		colliders.forEach(c => {
			dynamic.forEach((d, i) => {
				if (d.collidesWith(c)) {
					collisions[i].push(c);

					const rb = d.getComponent(Rigidbody)!;
					const cy = c.transform.position.y;
					const y = d.transform.position.y;
					if (cy > y) {
						const offsetY = d.top - c.bottom;
						d.transform.position.y -= offsetY;
					} else {
						const offsetY = c.top - d.bottom;
						d.transform.position.y += (offsetY - 0.005); // todo: make this offset configurable
					}

					if (rb.velocity.y < 0) {
						rb.velocity.y = 0;
					}
					d.gameObject.onCollision(c);
				}
			});
		});
		return collisions;
	}
}

//this.previousDynamicCollisions.forEach((c, index) => {
//	const i = dynamicColliders.indexOf(c);
//	if (i === -1) {
//		this.previousCollisions[index].forEach(col => c.gameObject.onCollisionLeave(col));
//		return;
//	}

//	const checks = collisions[i]!;

//	this.previousCollisions[index].forEach(col => {
//		if (!checks.includes(col)) {
//			c.gameObject.onCollisionLeave(col);
//		}
//	});
//});

//this.previousDynamicCollisions = dynamicColliders;
//this.previousCollisions = collisions;

//collisions.forEach((colliders, i) => {
//	const d = dynamicColliders[i]! as BoxCollider;
//	// todo: calculate x offset
//	const { y } = d.transform.position;

//	colliders.forEach(c => {
//		const rb = d.getComponent(Rigidbody)!;
//		const cy = c.transform.position.y;
//		const t = c as BoxCollider;
//		if (cy > y) {
//			const offsetY = d.top - t.bottom;
//			d.transform.position.y -= offsetY;
//		} else {
//			const offsetY = t.top - d.bottom;
//			d.transform.position.y += (offsetY - 0.005); // todo: make this offset configurable
//		}

//		if (rb.velocity.y < 0) {
//			rb.velocity.y = 0;
//		}
//		d.gameObject.onCollision(c);
//	});

//	// todo: add onCollisionLeave
//});