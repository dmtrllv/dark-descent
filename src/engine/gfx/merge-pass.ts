import type { Vec2 } from "../vec";
import { Material } from "./material";
import type { Renderer } from "./renderer";

export const renderMergedPasses = (renderer: Renderer, size: Vec2, lightMap: WebGLTexture, sprites: WebGLTexture) => {
	const material = Material.lightMerger.get();

	const gl = renderer.gl;

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(material.program);

	gl.bindBuffer(gl.ARRAY_BUFFER, renderer.vertexBuffer);
	gl.vertexAttribPointer(material.attributes.position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(material.attributes.position);

	gl.bindBuffer(gl.ARRAY_BUFFER, renderer.uvBuffer);
	gl.vertexAttribPointer(material.attributes.uv, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(material.attributes.uv);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, lightMap);
	gl.uniform1i(material.uniforms.lightMap, 0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, sprites);
	gl.uniform1i(material.uniforms.pixels, 1);

	gl.uniform2fv(material.uniforms.spriteSize, size.array);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}