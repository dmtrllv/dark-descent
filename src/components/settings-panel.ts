import { Component, RegistryItem, Sprite, Vec2 } from "../engine";
import { UI } from "../engine/gfx/ui";
import { Input } from "../engine/input";
import { SceneManager } from "../engine/scene-manager";
import { backTxt, buttonBackground, buttonBackgroundHover, graphicsTxt, soundTxt } from "../sprites";

export class SettingsPanel extends Component {
	public _hidden: boolean = true;

	public get hidden() { return this._hidden; }
	public set hidden(hidden: boolean) {
		if (hidden === this._hidden)
			return;

		this._hidden = hidden;
		this.uiComponents.forEach(c => c.hidden = this._hidden);
	}

	public readonly toggleHidden = () => this.hidden = !this._hidden;

	private readonly uiComponents: UI[] = [];

	public onInit(): void {
		this.addButton(soundTxt, new Vec2(0, 2), this.openSound);
		this.addButton(graphicsTxt, new Vec2(0, 0), this.openGraphics);
		this.addButton(backTxt, new Vec2(0, -2), () => { this.hidden = true; });
	}

	private readonly openSound = () => {
		console.log("openSound");
	}

	private readonly openGraphics = () => {
		console.log("openGraphics");
	}

	private readonly addButton = (txt: RegistryItem<Sprite>, position: Vec2, onClick: () => void) => {
		this.uiComponents.push(SceneManager.activeScene.spawn(position).addComponent(UI, {
			onClick,
			background: buttonBackground.get(),
			sprite: txt.get(),
			hoverSprite: buttonBackgroundHover.get(),
			hidden: this._hidden,
		}))
	}

	public onUpdate(): void {
		if(Input.wentDown("escape")) {
			this.toggleHidden();
		}
	}
}