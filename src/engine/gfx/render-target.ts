import type { Vec2 } from "../vec";

export class RenderTarget {
	public size: Vec2;
	public fb: WebGLFramebuffer;
	public targetTexture: WebGLTexture;

	public constructor(gl: GL, size: Vec2) {
		this.size = size;
		this.targetTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.x, this.size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);

	}

	public resize(gl: GL, newSize: Vec2) {
		this.size = newSize;

		gl.deleteTexture(this.targetTexture);

		this.targetTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size.x, this.size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}
	
	public render(gl: GL, callback: () => any): WebGLTexture {
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.size.x, this.size.y);
		callback();
		return this.targetTexture;
	}
}