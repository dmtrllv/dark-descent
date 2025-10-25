import type { Material } from "./material";
import { RenderComponent } from "./render-component";
import { Renderer } from "./renderer";
import type { Sprite } from "./sprite";

export class SpriteRenderer extends RenderComponent {
	public sprite: Sprite | null = null;
	private positionBuffer!: WebGLBuffer;
	public flip: boolean = false;

	public onInit(): void {
		super.onInit();
		this.positionBuffer = Renderer.createArrayBuffer([0, 0]);
	}

	public readonly updateDirty = (gl: GL) => {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.transform.position.farray, gl.DYNAMIC_DRAW);
	}

	public render(renderer: Renderer, material: Material) {
		if (!this.sprite)
			return;

		const gl = renderer.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.vertex, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.vertex);

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
		gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.uv);

		gl.uniform2fv(material.uniforms.position, this.transform.position.farray);
		gl.uniform1i(material.uniforms.flip, +this.flip);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);
		gl.uniform1i(material.uniforms.sampler, 0);

		gl.uniform2fv(material.uniforms.spriteSize, this.sprite.size);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}