import type { Engine } from "../engine";
import type { Material } from "./material";
import { RenderComponent } from "./render-component";
import type { Renderer } from "./renderer";
import type { Sprite } from "./sprite";

export class SpriteRenderer extends RenderComponent {
	public sprite: Sprite | null = null;
	private positionBuffer!: WebGLBuffer;

	public init(game: Engine): void {
		super.init(game);
		this.positionBuffer = game.renderer.createArrayBuffer([0, 0]);
	}

	public render(renderer: Renderer, material: Material) {
		if (!this.sprite)
			return;

		const gl = renderer.gl;

		this.transform.resolveDirty(() => {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.transform.position.farray, gl.DYNAMIC_DRAW);
		});

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
		gl.vertexAttribPointer(material.attributes.position, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.position);

		gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
		gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(material.attributes.uv);

		gl.uniform2fv(material.uniforms.position, this.transform.position.farray);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);
		gl.uniform1i(material.uniforms.sampler, 0);

		gl.uniform2fv(material.uniforms.spriteSize, this.sprite.size);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}