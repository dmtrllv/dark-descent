import { Component } from "../component";
import { Color } from "../color";
import { Renderer } from "./renderer";
import type { Material } from "./material";
import { Layer } from "./layers";

export class Light extends Component {
	public color: Color = new Color(1, 1, 1, 0);
	public intensity: number = 1;
	public falloff: number = 1;
	public radius: number = 1;

	public targetLayers: Layer[] | "all" = "all";

	private positionBuffer!: WebGLBuffer;

	public onInit(): void {
		this.positionBuffer = Renderer.createArrayBuffer([0, 0]);
		if (this.targetLayers === "all") {
			Layer.registry.forEach(l => l.lights.add(this));
		} else {
			this.targetLayers.forEach(l => l.lights.add(this));
		}
	}

	public readonly updateDirty = (gl: GL) => {
		// not used??
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.transform.position.farray, gl.DYNAMIC_DRAW);
	}

	public readonly render = (renderer: Renderer, material: Material) => {
		const gl = renderer.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.position);

		gl.uniform2fv(material.uniforms.position, this.transform.position.farray);
		gl.uniform4fv(material.uniforms.color, this.color.array);
		gl.uniform1f(material.uniforms.intensity, this.intensity);
		
		//gl.uniform1f(material.uniforms.falloff, this.falloff);
		gl.uniform1f(material.uniforms.radius, this.radius);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}