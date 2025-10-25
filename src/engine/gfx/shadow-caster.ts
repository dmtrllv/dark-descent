import { Component } from "../component";
import { Vec2 } from "../vec";
import type { Layer } from "./layers";
import type { Light } from "./light";
import type { Material } from "./material";
import type { Renderer } from "./renderer";
import { SpriteRenderer } from "./sprite-renderer";

export class ShadowCaster extends Component {
	public targetLayers: Layer[] | "all" = "all";

	public readonly size: Vec2 = new Vec2(1, 1);

	public readonly spriteRenderer = this.getComponent(SpriteRenderer)!;

	public get points(): Vec2[] {
		const { x, y } = this.transform.position;
		return [
			new Vec2(x - this.size.x, y - this.size.y),
			new Vec2(x - this.size.x, y + this.size.y),
			new Vec2(x + this.size.x, y + this.size.y),
			new Vec2(x + this.size.x, y - this.size.y),
		]
	}

	public onStart(): void {
		if (this.spriteRenderer === null) {
			throw new Error(`No Sprite renderer provided!`);
		}
	}

	public readonly render = (renderer: Renderer, material: Material, light: Light) => {
		const p = this.points;
		const gl = renderer.gl;
		const sr = this.getComponent(SpriteRenderer)!;

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.vertex);

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
		gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.uv);

		gl.uniform2fv(material.uniforms.position, this.transform.position.farray);
		gl.uniform1i(material.uniforms.flip, +sr.flip);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, sr.sprite!.texture);
		gl.uniform1i(material.uniforms.sampler, 0);

		gl.uniform2fv(material.uniforms.spriteSize, sr.sprite!.size);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}