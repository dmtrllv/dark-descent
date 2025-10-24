import { Scene, Camera, Vec2, SpriteRenderer, Animator } from "../../engine";

import { Fire, Map, Moon, NetworkPlayer, Player } from "../gameobjects";
import { CamPlayerFollower, SettingsPanel } from "../components";

import * as sprites from "../sprites";
import { bird1, bird2, bird3 } from "../audio";
import { MuteBtn } from "../components/mute-btn";
import { io, Socket } from "socket.io-client";
import { playerAnimation, playerWalkingAnimation } from "../animations";

export class FirstScene extends Scene {
	public static online: boolean = false;

	private players: Record<string, NetworkPlayer> = {};

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
					position: new Vec2(-3, -2.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(0, -2.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(3, -3)
				},
				{
					background: sprites.platform,
					position: new Vec2(6, -2.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(9, -2.8)
				},
				{
					background: sprites.platform,
					position: new Vec2(12, -2.8)
				}
			],
		});

		let socket: Socket | null = null;
		if (FirstScene.online) {
			socket = io();

			await new Promise<void>((res) => {
				socket!.emit("get-current-players");
				socket!.on("current-players", (players) => {
					for (const k in players) {
						const { x, y } = players[k];
						const p = this.spawn(NetworkPlayer, new Vec2(x, y));
						this.players[k] = p as NetworkPlayer;
					}
					res();
				});
			});
		}

		camera.target = this.spawn(Player, new Vec2(0, 2), socket).transform;

		this.spawn(Fire, new Vec2(-3, -2.4));
		this.spawn(Fire, new Vec2(12, -2.4));

		this.spawn().addComponent(SettingsPanel);
		this.spawn(new Vec2(-1, 1)).addComponent(MuteBtn);

		this.playBirds();

		if (FirstScene.online) {
			socket!.on("player-connected", k => {
				this.players[k] = this.spawn(NetworkPlayer) as NetworkPlayer;
			});

			socket!.on("player-disconnected", (k) => {
				this.players[k].destroy();
				delete this.players[k];
			});

			socket!.on("player-update", (id, player) => {
				const p = this.players[id];
				const x = p.transform.position.x;
				p.transform.position = new Vec2(player.x, player.y);
				p.getComponent(SpriteRenderer)!.flip = player.x < x;
				const anim = p.getComponent(Animator)!;
				if(player.isWalking) {
					anim.animation = playerWalkingAnimation.get();
				} else {
					anim.animation = playerAnimation.get();
				}
			});
		}
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