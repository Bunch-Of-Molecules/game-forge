import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const WhackAMoleGame: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        class WhackScene extends Phaser.Scene {
            started = false;
            score = 0;
            scoreText!: Phaser.GameObjects.Text;
            mole!: Phaser.GameObjects.Sprite;
            holes: Phaser.Math.Vector2[] = [];

            preload() {
                this.load.image("table", "/Game Assets/WhackAMole/table.png");
                this.load.image("hole", "/Game Assets/WhackAMole/hole.png");
                this.load.spritesheet("mole", "/Game Assets/WhackAMole/mole.png", {
                    frameWidth: 80,
                    frameHeight: 80,
                });
            }

            create() {
                this.started = false;

                const startText = this.add.text(300, 250, "Click to Start", {
                    fontSize: "28px",
                    color: "#fff",
                    backgroundColor: "#000",
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setOrigin(0.5).setDepth(3);

                this.input.once("pointerdown", () => {
                    this.started = true;
                    startText.destroy();

                });
                // Table background
                this.add.rectangle(300, 400, 600, 350, 0x8b4513); // Brown lower 2/3 background

                // Text headers
                this.scoreText = this.add.text(20, 20, "Score: 0", {
                    fontFamily: "monospace",
                    fontSize: "24px",
                    color: "#ffffff",
                    backgroundColor: "#000000",
                    padding: { left: 6, right: 6, top: 2, bottom: 2 }
                }).setDepth(2);
                this.add.text(300, 50, "Whack-a-mole", {
                    fontFamily: "Arial",
                    fontSize: "32px",
                    color: "#fff",
                    fontStyle: "bold"
                }).setOrigin(0.5).setDepth(2);

                // Hole positions
                const startX = 150;
                const startY = 280;
                const spacingX = 150;
                const spacingY = 100;

                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 3; col++) {
                        const x = startX + col * spacingX;
                        const y = startY + row * spacingY;
                        this.holes.push(new Phaser.Math.Vector2(x, y));
                        this.add.image(x, y + 20, "hole").setDisplaySize(100, 60).setDepth(1);
                    }
                }

                // Mole sprite
                this.mole = this.add.sprite(0, 0, "mole", 0)
                    .setInteractive()
                    .setDisplaySize(80, 80)
                    .setDepth(2)
                    .on("pointerdown", () => {
                        this.tweens.add({
                            targets: this.mole,
                            scaleX: 0.7,
                            scaleY: 0.7,
                            duration: 100,
                            yoyo: true,
                            ease: 'Power1',
                            onComplete: () => this.whack()
                        });
                    });

                this.mole.setVisible(false);
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        if (this.started) {
                            this.showMole();
                        } else {
                            this.mole.setVisible(false);
                        }
                    },
                    callbackScope: this,
                    loop: true
                });
            }

            showMole() {
                const pos = Phaser.Utils.Array.GetRandom(this.holes);
                this.mole.setPosition(pos.x, pos.y);
                this.mole.setVisible(true);
            }

            whack() {
                this.score++;
                this.scoreText.setText("Score: " + this.score);
                this.mole.setVisible(false);
            }
        }

        if (!gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 600,
            height: 500,
            parent: gameRef.current,
            scene: WhackScene,
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

export default WhackAMoleGame;
