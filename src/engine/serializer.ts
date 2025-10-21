export interface ISerializable<T> {
	serialize(): T;
	parse(data: T): void;
}

export const serialized = <T extends SerializableType<any>>(name: string) => (Class: T) => {
	return class extends Class {
		public constructor(...args: any[]) {
			super(...args);
			const data = localStorage.getItem(name);
			if(data === null) {
				localStorage.setItem(name, JSON.stringify(this.serialize()));
			} else {
				this.parse(JSON.parse(data));
			}
		}
	}
}

type SerializableType<T> = new (...args: any) => ISerializable<any>;