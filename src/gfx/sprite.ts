import { Registry } from "../registry";
import { Renderer } from "./renderer";

export class Sprite {
	public static readonly registry = new Registry<Sprite, [Renderer]>();

	private static readonly loadImage = (path: string) => new Promise<HTMLImageElement>((res, rej) => {
		const image = new Image();
		image.onload = () => res(image);
		image.onerror = () => rej(new Error(`Could not load image at /sprites/${path}!`));
		image.src = path;
	});

	public readonly img: HTMLImageElement;
	public readonly texture: WebGLTexture;

	private constructor(renderer: Renderer, img: HTMLImageElement) {
		const gl = renderer.gl;

		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.img = img;
		this.texture = texture;
	}


	private static readonly register = (path: string) => this.registry.register(async (renderer) => new Sprite(renderer, await this.loadImage(path)));

	public static readonly platform = this.register("/sprites/platform.bmp");
	public static readonly platform2 = this.register("/sprites/platform-2.bmp");
	public static readonly light = this.register("/sprites/light.bmp");
}