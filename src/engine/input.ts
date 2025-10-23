import { Vec2 } from "./vec";

export class Input {
	public static get mouse() {
		return this._instance._mouse;
	}

	public static get touch() {
		return this._instance._touch;
	}
	
	public static get touchStart() {
		return this._instance._touchStart;
	}

	private static readonly _instance = new Input();

	public static readonly isDown = this._instance.isDown.bind(this._instance);
	public static readonly areDown = this._instance.areDown.bind(this._instance);
	public static readonly isUp = this._instance.isUp.bind(this._instance);
	public static readonly wentUp = this._instance.wentUp.bind(this._instance);
	public static readonly wentDown = this._instance.wentDown.bind(this._instance);

	public static readonly tick = () => this._instance.tick();

	private readonly _down = new Set<string>();
	private readonly _wentDown = new Set<string>();
	private readonly _wentUp = new Set<string>();
	private readonly _mouse = new Vec2();
	private _touch: Vec2 | null = null;
	private _touchStart: Vec2 | null = null;

	private constructor() {
		window.addEventListener("mousemove", (e) => {
			this._mouse.x = e.clientX;
			this._mouse.y = e.clientY;
		});

		window.addEventListener("keydown", (e) => {
			const k = e.key.toLowerCase();
			switch (k) {
				case " ":
					this._wentDown.add("space");
					this._down.add("space");
					break;
				default:
					this._wentDown.add(k);
					this._down.add(k);
			}
		});

		window.addEventListener("keyup", (e) => {
			const k = e.key.toLowerCase();
			switch (k) {
				case " ":
					this._wentUp.add("space");
					this._down.delete("space");
					break;
				default:
					this._wentUp.add(k);
					this._down.delete(k);
			}
		});

		window.addEventListener("touchstart", (e) => {
			const { clientX, clientY } = e.touches[0];
			this._touchStart = new Vec2(clientX, clientY);
			this._touch = new Vec2(clientX, clientY);
		});

		window.addEventListener("touchmove", (e) => {
			const { clientX, clientY } = e.touches[0];
			this._touch = new Vec2(clientX, clientY);
		});

		window.addEventListener("touchend", () => {
			this._touch = null;
			this._touchStart = null;
		});
	}

	public readonly isDown = (key: string): boolean => this._down.has(key);

	public readonly areDown = (...keys: string[]): boolean => keys.find(k => !this.isDown(k)) === undefined;

	public readonly isUp = (key: string): boolean => !this.isDown(key);
	public readonly wentUp = (key: string): boolean => this._wentUp.has(key);
	public readonly wentDown = (key: string): boolean => this._wentDown.has(key);

	private readonly tick = () => {
		this._wentDown.clear();
		this._wentUp.clear();
	};
}