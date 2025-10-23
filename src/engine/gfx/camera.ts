import { Component } from "../component";
import { Vec2 } from "../vec";
import type { Material } from "./material";

export class Camera extends Component {
	public zoom: number = ((navigator as any).userAgentData?.mobile || window.innerWidth < 400) ? 4 : 8;
	public ambientOcclusion: number = 1;
	public pixelsPerUnit: number = 16;

	public readonly screenToWorld = ({ x, y }: Vec2) => {
		const w = window.innerWidth;
		const h = window.innerHeight;

		const hw = w / 2;
		const hh = h / 2;

		const wx = ((x - hw) * 2) / this.pixelsPerUnit;
		const wy = (-(y - hh) * 2) / this.pixelsPerUnit;

		return new Vec2(wx / this.zoom + this.transform.position.x, wy / this.zoom + this.transform.position.y);
	}

	public useUniforms(gl: GL, material: Material) {
		gl.uniform1f(material.uniforms.zoom, this.zoom);
		gl.uniform1f(material.uniforms.ambientOcculision, this.ambientOcclusion);
		gl.uniform1f(material.uniforms.pixelsPerUnit, this.pixelsPerUnit);
		gl.uniform2fv(material.uniforms.cameraPosition, this.transform.position.array);
	}
}