import { AudioManager, Camera, Component, RegistryItem, Scene, Sprite, Vec2 } from "../engine";
import { UI } from "../engine/gfx/ui";
import { buttonBackground, buttonBackgroundHover, muteSprite, playOfflineTxt, playOnlineTxt, settingsTxt, unmuteSprite } from "../sprites";

export class StartMenu extends Scene {
	private readonly addMenuButton = (txt: RegistryItem<Sprite>, position: Vec2, onClick: () => void) => {
		this.spawn(position).addComponent(UI, {
			onClick,
			background: buttonBackground.get(),
			sprite: txt.get(),
			hoverSprite: buttonBackgroundHover.get()
		});
	}
	public async onLoad() {
		this.spawn().addComponent(Camera);

		this.addMenuButton(playOfflineTxt, new Vec2(0, 2), this.startOffline);
		this.addMenuButton(playOnlineTxt, new Vec2(0, 0), this.startOnline);
		this.addMenuButton(settingsTxt, new Vec2(0, -2), this.openSettings);

		this.spawn(new Vec2(-1, 1)).addComponent(MuteBtn);
	}

	private readonly startOnline = () => {
		console.log("startOnline");
	}

	private readonly openSettings = () => {
		console.log("openSettings");
	}

	private readonly startOffline = () => {
		console.log("startOffline");
	}
}

class MuteBtn extends Component {
	public readonly muteSprite = muteSprite.get();
	public readonly unmuteSprite = unmuteSprite.get();

	public readonly ui = this.addComponent(UI, {
		onClick: () => {
			AudioManager.toggleMute();
			this.ui.sprite = AudioManager.isMuted ? this.unmuteSprite : this.muteSprite;
		},
		sprite: this.muteSprite,
		anchor: new Vec2(1, -1),
	});
}