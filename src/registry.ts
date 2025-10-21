export class Registry<T = never, Args extends any[] = []> {
	public constructor() {}

	private readonly items: RegistryItem<T, Args>[] = [];

	private _isLoaded = false;

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	public readonly load = async (...args: Args) => {
		await Promise.all(this.items.map(t => t["_init"](...args)));
		this._isLoaded = true;
	}

	public readonly register = (init: (...args: Args) => (T | Promise<T>)): RegistryItem<T, Args> => {
		const item = new RegistryItem(init);
		this.items.push(item);
		return item;
	}

	public readonly forEach = (callback: (item: T) => void) => {
		this.items.forEach(item => callback(item.get()));
	}
}

export class RegistryItem<T, Args extends any[] = any> {
	private _data: T | undefined = undefined;
	private readonly _init: (...args: Args) => Promise<void>;
	
	public get() {
		if(this._data === undefined)
			throw new Error(`Not loaded!`);
		return this._data;
	}

	public constructor(init: (...args: Args) => (T | Promise<T>)) {
		this._init = async (...args: Args) => {
			this._data = await init(...args);
		};		
	}
}