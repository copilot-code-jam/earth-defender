// src/scenes/Game.ts
import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  ball: Phaser.GameObjects.Sprite;
  ballVelocity: Phaser.Math.Vector2;

  constructor() {
    super("Game");
  }

  spaceship: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {
    this.load.image("spaceship", "assets/spaceship.png");
    this.load.image("ball", "assets/ball.png"); // Load the ball image
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000); // Change background color to black

    this.background = this.add.image(0, 0, "space-background").setOrigin(0, 0);
    this.background.displayWidth = this.sys.game.config.width as number;
    this.background.displayHeight = this.sys.game.config.height as number;
    this.background.setAlpha(0.5);

    this.spaceship = this.add.sprite(400, 600, "spaceship"); // Adjusted y-coordinate to 600
    this.spaceship.setScale(4, 1); // Increase the width of the spaceship
    this.cursors = this.input.keyboard.createCursorKeys();

    this.ball = this.add.sprite(this.spaceship.x, this.spaceship.y - 50, "ball"); // Add ball on top of spaceship
    this.ball.setScale(0.5); // Adjust the size of the ball
    this.ballVelocity = new Phaser.Math.Vector2(0, -200); // Initialize ball velocity to move up

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

    // Prevent the spaceship from leaving the window
    if (this.spaceship.x < 0) {
      this.spaceship.x = 0;
    } else if (this.spaceship.x > this.sys.game.config.width as number) {
      this.spaceship.x = this.sys.game.config.width as number;
    }

    this.ball.x += this.ballVelocity.x * this.game.loop.delta / 1000;
    this.ball.y += this.ballVelocity.y * this.game.loop.delta / 1000;

    // Bounce the ball against the window frame
    if (this.ball.x < 0 || this.ball.x > this.sys.game.config.width as number) {
      this.ballVelocity.x *= -1;
    }
    if (this.ball.y < 0) {
      this.ballVelocity.y *= -1;
    }

    // Bounce the ball against the spaceship
    if (this.ball.y > this.spaceship.y - 50 && this.ball.y < this.spaceship.y && this.ball.x > this.spaceship.x - this.spaceship.displayWidth / 2 && this.ball.x < this.spaceship.x + this.spaceship.displayWidth / 2) {
      this.ballVelocity.y = -Math.abs(this.ballVelocity.y); // Ensure the ball bounces upwards
    }

    // End the game if the ball touches the bottom of the window
    if (this.ball.y > this.sys.game.config.height as number) {
      this.scene.start("GameOver");
    }
  }
}
