export class Registry<T = never, Args extends any[] = []> {
	public constructor() { }

	private readonly items: RegistryItem<T, Args>[] = [];

	private _isLoaded = false;

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	public readonly load = async (...args: Args) => {
		await Promise.all(this.items.map(t => t["_init"](...args)));
		this._isLoaded = true;
	}

	public readonly register = <U extends T>(init: (...args: Args) => (U | Promise<U>)): RegistryItem<U, Args> => {
		const item = new RegistryItem(init);
		this.items.push(item);
		return item;
	}

	public readonly forEach = (callback: (item: T) => void) => {
		this.items.forEach(item => {
			const data = item["_data"];
			if (data !== undefined)
				callback(data);
		});
	}

	public readonly find = (callback: (item: T) => boolean): T | null => {
		return this.items.find(item => {
			const data = item["_data"];
			if (data !== undefined)
				return callback(data);
			return false;
		})?.get() || null;
	}
}

export class RegistryItem<T extends NonNullable<any>, Args extends any[] = any> {
	private _data: T | undefined = undefined;
	private readonly _init: (...args: Args) => Promise<void>;

	public get() {
		if (this._data === undefined)
			throw new Error(`Not loaded!`);
		return this._data;
	}

	public constructor(init: (...args: Args) => (T | Promise<T>)) {
		this._init = async (...args: Args) => {
			this._data = await init(...args);
		};
	}
}