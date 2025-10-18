export class Registry<T = never, Args extends any[] = never> {
	public constructor() {}

	private readonly items: RegistryItem<T, Args>[] = [];

	public readonly load = async (...args: Args) => {
		await Promise.all(this.items.map(t => t["_init"](...args)));
	}

	public readonly register = (init: (...args: Args) => (T | Promise<T>)): RegistryItem<T, Args> => {
		const item = new RegistryItem(init);
		this.items.push(item);
		return item;
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