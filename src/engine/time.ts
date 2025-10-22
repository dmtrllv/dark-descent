export class Time {
	private static _delta: number = 0;
	private static _time: number = 0;

	public static get delta() { return this._delta; }
	public static get time() { return this._time; }

	public static readonly update = (delta: number) => {
		this._delta = delta / 1000;
		this._time += this._delta;
	}

	private constructor() {}
}