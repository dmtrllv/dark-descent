import { Component } from "../component";
import { Color } from "../color";

export class Light extends Component {
	public color: Color = new Color();
	public intensity: number = 1;
	public falloff: number = 1;
	public radius: number = 1;
}