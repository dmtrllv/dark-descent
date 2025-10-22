import { Component } from "../component";

export abstract class Collider extends Component {
	abstract get top(): number;
	abstract get bottom(): number;

	public abstract collidesWith(col: Collider): boolean;
}