import { Component, AudioManager, Vec2 } from "../../engine";
import { UI } from "../../engine/gfx/ui";
import { muteSprite, unmuteSprite } from "../sprites";

export class MuteBtn extends Component {
	public readonly muteSprite = muteSprite.get();
	public readonly unmuteSprite = unmuteSprite.get();

	private getSprite = () => AudioManager.isMuted ? this.unmuteSprite : this.muteSprite;

	public readonly ui = this.addComponent(UI, {
		onClick: () => {
			AudioManager.toggleMute();
			this.ui.sprite = this.getSprite();
		},
		sprite: this.getSprite(),
		anchor: new Vec2(1, -1),
	});
}