import { MuteBtn } from "../components/mute-btn";
import { Camera, RegistryItem, Scene, Sprite, Vec2 } from "../../engine";
import { UI } from "../../engine/gfx/ui";
import { SceneManager } from "../../engine/scene-manager";
import { buttonBackground, buttonBackgroundHover, playOfflineTxt, playOnlineTxt, settingsTxt } from "../sprites";
import { FirstScene } from "./first";

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
		FirstScene.online = true;
		SceneManager.load(FirstScene);
	}
	
	private readonly openSettings = () => {
		console.log("openSettings");
	}
	
	private readonly startOffline = () => {
		FirstScene.online = false;
		SceneManager.load(FirstScene);
	}
}
