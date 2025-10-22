export class Input {
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

	private constructor() {
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