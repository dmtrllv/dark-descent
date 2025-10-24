export class Time {
	private static _delta: number = 0;
	private static _time: number = 0;
	
	public static get delta() { return this._delta; }
	public static get time() { return this._time; }
	public static get lastTick() { return this._lastTick; }

	private static _lastTick = performance.now();

	public static readonly tick = () => {
		const now = performance.now();
		const d = now - this.lastTick;
		this._lastTick = now;
		this._delta = d / 1000;
		this._time += this._delta;
		
	}

	public static readonly resume = () => {
		this._lastTick = performance.now();
	}

	private constructor() { }
}