import { Component } from "../component";

export class Camera extends Component {
	public zoom: number = 1 / 4;
	public ambientOcculision: number = 1;

	public init(): void {
		(window as any).ao = (v: number) => {
			this.ambientOcculision = v;
		} 
	}
}