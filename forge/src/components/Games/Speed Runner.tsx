import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const SpeedRunnerSolo: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        class RunnerScene extends Phaser.Scene {
            platforms!: Phaser.Physics.Arcade.StaticGroup;
            walls!: Phaser.Physics.Arcade.StaticGroup;
            player!: Phaser.Physics.Arcade.Sprite;
            cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
            cameraSpeed = 1;
            levelWidth = 1000;
            gameOver = false;
            started = false;

            preload() {
                this.load.image("tiles", "/Game Assets/Speed Runner/tiles.png");
                this.load.spritesheet("player", "/Game Assets/Speed Runner/player.png", {
                    frameWidth: 28,
                    frameHeight: 64,
                });
            }

            create(data: { showStart?: boolean } = {}) {
                if (data.showStart !== false) this.showStartScreen();

                this.platforms = this.physics.add.staticGroup();
                this.walls = this.physics.add.staticGroup();

                this.SpawnTerrain(0, this.levelWidth);

                if (data.showStart !== false) this.showStartScreen();

                this.cameras.main.setBackgroundColor("#87ceeb");

                // Player
                this.player = this.physics.add.sprite(200, 350, "player")
                    .setBounce(0.1)
                    .setCollideWorldBounds(false);

                this.physics.add.collider(this.player, this.platforms);
                this.physics.add.collider(this.player, this.walls);

                //@ts-ignore
                this.cursors = this.input.keyboard.createCursorKeys();

                // Camera
                this.cameras.main.setBounds(0, 0, this.levelWidth, 600);
                this.physics.world.setBounds(0, 0, this.levelWidth, 600);
                // this.cameras.main.startFollow(this.player);

                // Wall jumping logic helper
                this.player.setData("canWallJump", true);
            }

            SpawnTerrain(startX: number, endX: number) {
                for (let i = startX; i < endX; i += 128) {
                    if (Math.random() < 0.2) continue; // gap
                    this.platforms.create(i, 450, "tiles").setScale(2).refreshBody();
                }
                for (let i = startX + 600; i < endX; i += 256) {
                    if (Math.random() < 0.99) {
                        const wallHeight = Phaser.Math.Between(2, 3);
                        for (let j = 0; j < wallHeight; j++) {
                            this.walls.create(i, 450 - j * 128, "tiles").setScale(2).refreshBody();
                        }
                    }
                }
            }

            showStartScreen() {
                this.started = false;
                const startText = this.add.text(400, 300, "Click to Start", {
                    fontSize: "28px",
                    color: "#fff",
                    backgroundColor: "#000",
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setOrigin(0.5).setDepth(3);

                this.input.once("pointerdown", () => {
                    this.started = true;
                    startText.destroy();
                });
            }

            triggerGameOver() {
                if (this.gameOver) return;
                this.gameOver = true;

                this.physics.pause();
                this.player.setTint(0xff0000);

                this.add.text(
                    this.cameras.main.scrollX + 400,
                    200,
                    "Game Over\nClick to Restart",
                    {
                        fontSize: "32px",
                        color: "#f00",
                        align: "center",
                        backgroundColor: "#000",
                        padding: { left: 10, right: 10, top: 5, bottom: 5 }
                    }
                ).setOrigin(0.5).setDepth(3);

                this.input.once("pointerdown", () => {
                    this.scene.restart({ showStart: false });
                    this.started = true;
                    this.gameOver = false;
                });
            }


            update() {
                if (!this.started || this.gameOver) return;

                const cameraRightEdge = this.cameras.main.scrollX + 800;
                if (cameraRightEdge > this.levelWidth - 1000) {
                    const newChunkStart = this.levelWidth;
                    this.levelWidth += 1000;
                    this.SpawnTerrain(newChunkStart, this.levelWidth);

                    this.physics.world.setBounds(0, 0, this.levelWidth, 600);
                    this.cameras.main.setBounds(0, 0, this.levelWidth, 600);
                }

                //@ts-ignore
                const onGround = this.player.body.blocked.down;
                //@ts-ignore
                const touchingLeft = this.player.body.blocked.left;
                //@ts-ignore
                const touchingRight = this.player.body.blocked.right;

                // Movement
                if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-400);
                    this.player.setFlipX(true);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(400);
                    this.player.setFlipX(false);
                } else {
                    this.player.setVelocityX(0);
                }

                // Jump / Wall Jump
                if (this.cursors.up.isDown) {
                    if (onGround) {
                        this.player.setVelocityY(-330);
                    } else if ((touchingLeft || touchingRight) && this.player.getData("canWallJump")) {
                        this.player.setVelocityY(-330);

                        // Push slightly away from the wall
                        if (touchingLeft) {
                            this.player.setVelocityX(150);
                        } else if (touchingRight) {
                            this.player.setVelocityX(-150);
                        }

                        this.player.setData("canWallJump", false);
                        this.time.delayedCall(250, () => {
                            this.player.setData("canWallJump", true);
                        });
                    }
                }

                // Scroll camera forward
                this.cameras.main.scrollX += this.cameraSpeed;

                // Game over if left behind
                if (this.player.x < this.cameras.main.scrollX - 50) {
                    this.triggerGameOver();
                }
            }
        }

        if (!gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 600 },
                    debug: false,
                },
            },
            parent: gameRef.current,
            scene: RunnerScene,
        };

        const game = new Phaser.Game(config);
        return () => game.destroy(true);
    }, []);

    return (
        <div
            ref={gameRef}
            style={{
                width: "600px",
                height: "500px",
                overflow: "hidden",
                position: "relative",
                border: "2px solid #009480",
                borderRadius: "8px"
            }}/>
    );
};

export default SpeedRunnerSolo;
