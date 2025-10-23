import { Component, Transform, Time } from "../../engine";

export class CamPlayerFollower extends Component {
	public target: Transform | null = null;

	public onUpdate(): void {
		if (!this.target)
			return;

		const radius = 1;

		let offsetX = this.target.position.x - this.transform.position.x;
		let offsetY = this.target.position.y - this.transform.position.y;

		if (offsetX < radius && offsetX > -radius) {
			offsetX = 0;
		}

		if (offsetY < radius && offsetY > -radius) {
			offsetY = 0;
		}

		const x = (offsetX * (Time.delta / 2));
		const y = (offsetY * (Time.delta / 2));

		const px = this.transform.position.x;
		const py = this.transform.position.y;

		this.transform.position.x = px + x;
		this.transform.position.y = py + y;
	}
}
