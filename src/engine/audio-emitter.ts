import type { Audio } from "./audio";
import { Component } from "./component";

export class AudioEmitter extends Component {
	public audio: Audio | null = null;
	public radius: number = 7;
}