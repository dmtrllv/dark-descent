import { Input } from "../input";
import { SceneManager } from "../scene-manager";
import { Vec2 } from "../vec";
import { Camera } from "./camera";
import type { Material } from "./material";
import { RenderComponent } from "./render-component";
import { Renderer } from "./renderer";
import type { Sprite } from "./sprite";

export class UI extends RenderComponent {
	public hidden: boolean = false;
	public sprite: Sprite | null = null;
	public background: Sprite | null = null;
	public hoverSprite: Sprite | null = null;
	private positionBuffer!: WebGLBuffer;
	public anchor: Vec2 | null = null;

	public onClick?: () => void;

	public onInit(): void {
		super.onInit();
		this.positionBuffer = Renderer.createArrayBuffer([0, 0]);
		window.addEventListener("mousedown", this.onMouseDown);
	}

	public onDestroy(): void {
		super.onDestroy();
		window.removeEventListener("mousedown", this.onMouseDown);
	}

	private readonly onMouseDown = () => {
		if (this.isHovering() && this.onClick) {
			this.onClick();
		}
	}

	public render(renderer: Renderer, material: Material) {
		if(this.hidden)
			return;
		
		const b = this.isHovering() ? this.hoverSprite || this.background : this.background;

		if (!this.sprite)
			return;

		const cam = SceneManager.activeScene.getComponents(Camera)[0];

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

		const pos = this.calcPosition(cam);

		gl.uniform2fv(material.uniforms.position, pos.farray);
		gl.uniform1i(material.uniforms.flip, +false);

		gl.activeTexture(gl.TEXTURE0);

		if (b) {
			gl.bindTexture(gl.TEXTURE_2D, b.texture);
			gl.uniform1i(material.uniforms.sampler, 0);
			gl.uniform2fv(material.uniforms.spriteSize, b.size);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}

		gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);
		gl.uniform1i(material.uniforms.sampler, 0);
		gl.uniform2fv(material.uniforms.spriteSize, this.sprite.size);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	private calcPosition(cam: Camera): Vec2 {
		if (!this.anchor) {
			return Vec2.add(this.transform.position, cam.transform.position);
		}

		const w = window.innerWidth;
		const h = window.innerHeight;

		const x = ((this.anchor.x * w) / cam.pixelsPerUnit) / cam.zoom;
		const y = ((this.anchor.y * h) / cam.pixelsPerUnit) / cam.zoom;

		return new Vec2(x, y).add(this.transform.position).add(cam.transform.position);
	}

	public readonly isHovering = () => {
		if (!this.sprite)
			return false;

		const cam = SceneManager.activeScene.getComponents(Camera)[0];

		if (!cam)
			return false;

		const p = this.calcPosition(cam);

		const w = this.sprite.size[0] / 2 / cam.pixelsPerUnit;
		const h = this.sprite.size[1] / 2 / cam.pixelsPerUnit;
		const l = (p.x - w);
		const r = (p.x + w);
		const t = (p.y + h);
		const b = (p.y - h);
		const { x, y } = cam.screenToWorld(Input.mouse);
		return x > l && x < r && y < t && y > b;
	}
}