import { Registry } from "../registry";
import { Vec2 } from "../vec";
import type { Renderer } from "./renderer";
import { Sprite } from "./sprite";

export class SpriteSheet {
	public static registry = new Registry<SpriteSheet, [Renderer]>();

	public static readonly register = (path: string, count: number) => this.registry.register(async (renderer) => {
		const img = await this.loadImage(path);

		const canvas = document.createElement("canvas");

		canvas.height = img.height;
		canvas.width = img.width;
		const spriteWidth = Math.floor(img.width / count);

		const ctx = canvas.getContext("2d", {
			willReadFrequently: true
		})!;
		ctx.drawImage(img, 0, 0);
		const spriteData = [];

		for (let i = 0; i < count; i++) {
			spriteData.push(ctx.getImageData(i * spriteWidth, 0, spriteWidth, img.height));
		}
		return new SpriteSheet(renderer, new Vec2(spriteWidth, img.height), spriteData);
	});

	private static readonly loadImage = (path: string) => new Promise<HTMLImageElement>((res, rej) => {
		const image = new Image();
		image.onload = () => res(image);
		image.onerror = () => rej(new Error(`Could not load image at /sprites/${path}!`));
		image.src = path;
	});

	public readonly sprites: Sprite[] = [];
	public readonly size: Vec2;

	public constructor(renderer: Renderer, size: Vec2, sprites: ImageData[]) {
		this.size = size;
		this.sprites = sprites.map(s => new Sprite(renderer, s));
	}
}