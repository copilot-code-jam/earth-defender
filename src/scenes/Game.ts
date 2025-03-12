// src/scenes/Game.ts
import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  spaceship: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {
    this.load.image("spaceship", "assets/spaceship.png");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(0, 0, "space-background").setOrigin(0, 0);
    this.background.displayWidth = this.sys.game.config.width as number;
    this.background.displayHeight = this.sys.game.config.height as number;
    this.background.setAlpha(0.5);

    this.spaceship = this.add.sprite(400, 600, "spaceship"); // Adjusted y-coordinate to 600
    this.spaceship.setScale(4, 1); // Increase the width of the spaceship
    this.cursors = this.input.keyboard.createCursorKeys();

    this.msg_text = this.add.text(512, 384, "Make something fun!", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.msg_text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("GameOver");
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.spaceship.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.spaceship.x += 5;
    }
  }
}
