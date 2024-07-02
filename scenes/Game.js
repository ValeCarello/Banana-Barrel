// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");

    // Variables
    this.bananasCollected = 0;
    this.initialLives = 3; // Store initial lives
    this.lives = this.initialLives;
    this.objectFallSpeed = 300;
  }

  preload() {
    // Load assets
    this.load.image("background", "./public/assets/background.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.atlas("player", "./public/assets/player.png", "./public/assets/player.json");
    this.load.image("banana", "./public/assets/banana.webp");
    this.load.image("banana-life", "./public/assets/banana-life.png");
    this.load.image("rock", "./public/assets/rock.webp");
    this.load.image("coconut", "./public/assets/coconut.webp");
    this.load.image("peach", "./public/assets/peach.png");
    this.load.image("pineapple", "./public/assets/pineapple.webp");
  }

  create() {
    // Background and platform
    this.add.image(400, 300, "background");
    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "platform").setScale(1.9).refreshBody();

    // Player
    this.player = this.physics.add.sprite(400, 420, "player", "adventurer-idle-00.png");
    this.player.setScale(3);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.7);
    this.player.setGravityY(850);

    // Collisions
    this.physics.add.collider(this.player, this.platform, this.onPlatform, null, this);
    this.physics.add.collider(this.player, this.physics.world.bounds, this.playerHitWorldBounds, null, this);

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', () => {
      this.doJump();
    }, this);

    // Flag
    this.isOnPlatform = false;

    // Object dropping
    this.time.addEvent({
      delay: 2000,
      callback: this.dropObject,
      callbackScope: this,
      loop: true
    });

    // UI
    this.bananaText = this.add.text(10, 10, 'Bananas: 0', { fontSize: '24px', fill: '#ffffff' });
    this.livesImages = [];
    this.updateLivesUI(); // Update lives UI
    this.objectFallSpeed = 300; // Initial object fall speed

    // Increase difficulty over time
    this.time.addEvent({
      delay: 10000, // Increase every 10 seconds
      callback: () => {
        this.objectFallSpeed += 50; // Increase object fall speed
      },
      loop: true
    });
  }

  update() {
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Mouse movement
    const mouseX = this.input.mousePointer.x;
    const speed = 0.05; // Adjust how quickly player follows mouse
    this.player.x = Phaser.Math.Interpolation.Linear([this.player.x, mouseX], speed);

    // Keep player on platform if on one
    if (this.isOnPlatform) {
      this.keepPlayerOnPlatform();
    }

    // Check if player falls off screen
    if (this.player.y > this.cameras.main.height) {
      this.loseAllLives(); // Lose all lives if player falls off
    }
  }

  onPlatform(player, platform) {
    this.isOnPlatform = true;
    player.body.touching.down = true;
  }

  doJump() {
    if (this.player.body.touching.down || this.player.body.onFloor()) {
      this.player.setVelocityY(-500); // Jump velocity
      this.isOnPlatform = false; // Reset platform flag
    }
  }

  playerHitWorldBounds() {
    // Handle world bounds collision
  }

  dropObject() {
    const objects = ["rock", "coconut", "pineapple", "banana", "peach"];
    const randomObject = Phaser.Math.RND.pick(objects); // Randomly pick an object
    const x = Phaser.Math.Between(100, 700); // Random x position
    const y = -50; // Starting y position
    let object;

    // Create and handle different objects
    if (randomObject === "banana") {
      object = this.physics.add.image(x, y, randomObject);
      object.setScale(0.05).setGravityY(300); // Scale and gravity
      this.physics.add.collider(object, this.platform, (banana, platform) => {
        this.loseLife(); // Lose life if banana hits platform
        banana.destroy();
      });
      this.physics.add.overlap(this.player, object, this.collectBanana, null, this);
    } else if (randomObject === "peach") {
      if (this.lives < this.initialLives) { // Drop peach only if lives are less than max
        object = this.physics.add.image(x, y, randomObject);
        object.setScale(0.15).setGravityY(300); // Scale and gravity
        this.physics.add.collider(object, this.platform, (peach, platform) => {
          peach.destroy();
        });
        this.physics.add.collider(object, this.player, (peach, player) => {
          this.collectPeach(); // Collect peach and gain life
          peach.destroy();
        });
      }
    } else {
      object = this.physics.add.image(x, y, randomObject);
      object.setScale(0.08).setGravityY(300); // Scale and gravity
      this.physics.add.collider(object, this.platform, (object, platform) => {
        if (randomObject === "rock") {
          object.setVelocity(150, -350); // Example direction right and up
        } else if (randomObject === "coconut") {
          object.setVelocity(-150, -350); // Example direction left and up
        } else if (randomObject === "pineapple") {
          object.setVelocity(150, -350); // Example direction right and up
        }
      });
      this.physics.add.overlap(this.player, object, this.loseAllLives, null, this);
    }

    if (object) {
      object.setVelocityY(this.objectFallSpeed); // Set falling speed if object exists
    }
  }

  collectPeach() {
    if (this.lives < this.initialLives) {
      this.lives++; // Increase lives if less than max
      this.updateLivesUI(); // Update UI
    }
  }

  collectBanana(player, banana) {
    banana.disableBody(true, true); // Disable physics and hide banana
    this.bananasCollected++; // Increment banana count
    this.bananaText.setText(`Bananas: ${this.bananasCollected}`); // Update UI text
    banana.destroy(); // Remove banana from game
  }

  loseLife() {
    this.lives--; // Decrease life count
    this.updateLivesUI(); // Update UI
    if (this.lives <= 0) {
      this.gameOver(); // Game over if no lives left
    }
  }

  loseAllLives() {
    this.lives = 0; // Set lives to zero
    this.updateLivesUI(); // Update UI
    this.gameOver(); // Trigger game over
  }

  gameOver() {
    this.lives = this.initialLives; // Reset lives
    this.scene.start("gameOver"); // Start game over scene
  }

  keepPlayerOnPlatform() {
    const platform = this.platform.children.entries[0]; // Get first platform
    const platformLeftEdge = platform.x - (platform.displayWidth / 2); // Left edge of platform
    const platformRightEdge = platform.x + (platform.displayWidth / 2); // Right edge of platform

    if (this.player.x < platformLeftEdge) {
      this.player.x = platformLeftEdge; // Ensure player stays on platform left edge
      this.player.setVelocityX(0); // Stop player movement
    } else if (this.player.x > platformRightEdge) {
      this.player.x = platformRightEdge; // Ensure player stays on platform right edge
      this.player.setVelocityX(0); // Stop player movement
    }
  }

  updateLivesUI() {
    // Clear previous life images
    this.livesImages.forEach(image => image.destroy());
    this.livesImages = [];

    // Display current lives
    for (let i = 0; i < this.lives; i++) {
      const lifeImage = this.add.image(50 + i * 30, 50, 'banana-life').setScale(0.02);
      this.livesImages.push(lifeImage); // Store life images
    }
  }
}



