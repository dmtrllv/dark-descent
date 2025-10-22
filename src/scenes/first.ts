import { Scene, Camera, Vec2 } from "../engine";

import { Fire, Map, Moon, Player } from "../gameobjects";
import { CamPlayerFollower } from "../components";

import * as sprites from "../sprites";
import { bird1, bird2, bird3 } from "../audio";
import { MuteBtn } from "../components/mute-btn";


export class FirstScene extends Scene {
	private readonly birdsSounds = [
		bird1.get(),
		bird2.get(),
		bird3.get(),
	];

	public async onLoad(): Promise<void> {
		const camera = this.spawn().addComponent(Camera).addComponent(CamPlayerFollower);

		this.spawn(Moon, camera.transform);

		this.spawn(Map, {
			backgrounds: [sprites.background],
			platforms: [
				{
					background: sprites.platform,
					position: new Vec2(-3, -0.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(0, -0.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(3, -1)
				},
				{
					background: sprites.platform,
					position: new Vec2(6, -0.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(9, -0.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(12, -0.8)
				}
			],
		});

		camera.target = this.spawn(Player, new Vec2(0, 2)).transform;

		this.spawn(Fire, new Vec2(-3, -0.4));
		this.spawn(Fire, new Vec2(12, -0.4));

		this.spawn(new Vec2(-1, 1)).addComponent(MuteBtn);

		this.playBirds();
	}

	private playBirds() {
		const play = () => {
			const bird = this.birdsSounds[Math.round(Math.random() * 2)];

			bird.play().then(() => {
				bird["audio"].volume = Math.random();
				setTimeout(() => {
					play();
				}, Math.random() * 16000);
			});
		};

		play();
	}
}
