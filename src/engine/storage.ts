export class Storage {
	private static readonly _storages: Record<string, Storage> = {};

	public static readonly load = (name: string) => {
		if (!(name in this._storages)) {
			this._storages[name] = new Storage(name);
		}
		return this._storages[name]!;
	}

	public readonly name: string;

	public constructor(name: string) {
		this.name = name;
	}

	public getString(key: string, defaultValue: string): string;
	public getString(key: string): string | null;
	public getString(key: string, defaultValue: string | null = null): string | null {
		const k = `${this.name}.${key}`;
		return localStorage.getItem(k) || defaultValue;
	}

	public appendString(key: string, string: string) {
		const val = this.getString(key, "") + string;
		this.setString(key, val);
	}

	public getJson<T extends object>(key: string, defaultValue: T): T;
	public getJson(key: string): object | null;
	public getJson<T extends object>(key: string, defaultValue: T | null = null): T | null {
		const k = `${this.name}.${key}`;
		const val = localStorage.getItem(k);
		return val ? JSON.parse(val) : defaultValue;
	}

	public setString(key: string, value: string) {
		const k = `${this.name}.${key}`;
		localStorage.setItem(k, value);
	}

	public setJson(key: string, value: any) {
		const k = `${this.name}.${key}`;
		localStorage.setItem(k, JSON.stringify(value));
	}
}