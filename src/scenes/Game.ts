// src/scenes/Game.ts
import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  ball: Phaser.GameObjects.Sprite;
  ballVelocity: Phaser.Math.Vector2;
  asteroidDestroyed: boolean = false;
  successText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  spaceship: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  asteroid: Phaser.GameObjects.Sprite;

  preload() {
    this.load.image("asteroid2", "assets/asteroid2.png");
    this.load.image("spaceship", "assets/body_01.png");
    this.load.image("ball", "assets/plasma_ball.png"); // Load the ball image
    this.load.image("asteroid_exploded", "assets/asteroid_exploded.png"); // Load the explosion image
  }

  create() {
    this.camera = this.cameras.main;

    const bgTexture = this.textures.get("space-background").getSourceImage();
    const bgWidth = bgTexture.width;
    const bgHeight = bgTexture.height;

    for (let x = 0; (x < this.sys.game.config.width) as number; x += bgWidth) {
      for (
        let y = 0;
        (y < this.sys.game.config.height) as number;
        y += bgHeight
      ) {
        this.add.image(x, y, "space-background").setOrigin(0, 0);
      }
    }

    this.camera.setBackgroundColor(0x000000); // Change background color to black

    this.background = this.add.image(0, 0, "space-background").setOrigin(0, 0);
    this.background.displayWidth = this.sys.game.config.width as number;
    this.background.displayHeight = this.sys.game.config.height as number;
    this.background.setAlpha(0.5);

    this.spaceship = this.add.sprite(400, 600, "spaceship"); // Adjusted y-coordinate to 600
    // this.spaceship.setScale(4, 1); // Increase the width of the spaceship
    this.cursors = this.input.keyboard.createCursorKeys();

    const asteroidX = Phaser.Math.Between(
      0,
      this.sys.game.config.width as number
    );
    const asteroidY = 50;
    this.asteroid = this.add.sprite(asteroidX, asteroidY, "asteroid2");
    this.asteroid.setDisplaySize(100, 100); // Ensure the size of the asteroid is 100px

    this.ball = this.add.sprite(
      this.spaceship.x,
      this.spaceship.y - 50,
      "ball"
    ); // Add ball on top of spaceship
    this.ball.setScale(0.05); // Adjust the size of the ball
    this.ballVelocity = new Phaser.Math.Vector2(0, -300); // Increase ball velocity to move up faster

    this.input.once("pointerdown", () => {
      this.scene.start("GameOver");
    });

    // Create success text but keep it hidden initially
    this.successText = this.add.text(
      this.sys.game.config.width as number / 2, 
      this.sys.game.config.height as number / 2, 
      'Success!\nAsteroid Destroyed!', 
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#00ff00',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    this.successText.setOrigin(0.5);
    this.successText.visible = false;
  }

  update() {
    // If the asteroid is destroyed, don't process other updates
    if (this.asteroidDestroyed) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.spaceship.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.spaceship.x += 5;
    }

    // Prevent the spaceship from leaving the window
    if (this.spaceship.x < 0) {
      this.spaceship.x = 0;
    } else if ((this.spaceship.x > this.sys.game.config.width) as number) {
      this.spaceship.x = this.sys.game.config.width as number;
    }

    this.ball.x += (this.ballVelocity.x * this.game.loop.delta) / 1000;
    this.ball.y += (this.ballVelocity.y * this.game.loop.delta) / 1000;

    // Bounce the ball against the window frame
    if (
      this.ball.x < 0 ||
      ((this.ball.x > this.sys.game.config.width) as number)
    ) {
      this.ballVelocity.x *= -1;
    }
    if (this.ball.y < 0) {
      this.ballVelocity.y *= -1;
    }

    // Bounce the ball against the spaceship
    if (
      this.ball.y > this.spaceship.y - 50 &&
      this.ball.y < this.spaceship.y &&
      this.ball.x > this.spaceship.x - this.spaceship.displayWidth / 2 &&
      this.ball.x < this.spaceship.x + this.spaceship.displayWidth / 2
    ) {
      const relativeHitPosition =
        (this.ball.x - this.spaceship.x) / (this.spaceship.displayWidth / 2);
      this.ballVelocity.x = relativeHitPosition * 200; // Adjust the horizontal velocity based on hit position
      this.ballVelocity.y = -Math.abs(this.ballVelocity.y); // Ensure the ball bounces upwards
    }

    // Check for collision between ball and asteroid
    if (
      this.asteroid && // Check if asteroid exists
      this.ball.x > this.asteroid.x - this.asteroid.displayWidth / 2 &&
      this.ball.x < this.asteroid.x + this.asteroid.displayWidth / 2 &&
      this.ball.y > this.asteroid.y - this.asteroid.displayHeight / 2 &&
      this.ball.y < this.asteroid.y + this.asteroid.displayHeight / 2
    ) {
      // Create explosion effect
      const explosion = this.add.sprite(
        this.asteroid.x,
        this.asteroid.y,
        "asteroid_exploded"
      );
      explosion.setDisplaySize(100, 100); // Ensure the size of the explosion is 100px

      // Remove the asteroid
      this.asteroid.destroy();

      // Show success screen
      this.showSuccessScreen();

      // Reset ball velocity
      this.ballVelocity.set(0, -300);
    }

    // End the game if the ball touches the bottom of the window
    if ((this.ball.y > this.sys.game.config.height) as number) {
      this.scene.start("GameOver");
    }
  }

  showSuccessScreen() {
    this.asteroidDestroyed = true;
    this.successText.visible = true;
    
    // Optional: Add animation to make it more appealing
    this.tweens.add({
      targets: this.successText,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Bounce.Out'
    });
    
    // Go to GameOver scene after a delay
    this.time.delayedCall(3000, () => {
      this.scene.start("GameOver");
    });
  }
}
