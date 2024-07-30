// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");

    // Variables
    this.bananasCollected = null;
    this.initialLives = 3; 
    this.lives = this.initialLives;
    this.objectFallSpeed = 300;
    
  }

  preload() {
    // Load assets
    this.load.image("background", "./public/assets/background.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.atlas("player", "./public/assets/player.png", "./public/assets/player.json");
    this.load.image("banana", "./public/assets/banana1.png");
    this.load.image("banana-life", "./public/assets/banana-life.png");
    this.load.image("rock", "./public/assets/rock.png");
    this.load.image("coconut", "./public/assets/coconut.png");
    this.load.image("peach", "./public/assets/peach.png");
    this.load.image("barrel", "./public/assets/barrel.png");
    this.load.audio('gameMusic', ['./public/audio/game_music.mp3', './public/audio/game_music.ogg']);
  }

  create() {

    // Play music for Game
    this.gameMusic = this.sound.add('gameMusic', { loop: true });
    this.gameMusic.volume = 0.5;
    this.gameMusic.play();


    this.bananasCollected = 0;
    // Background and platform
    this.add.image(400, 300, "background").setScale(1);
    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "platform").setScale(1).refreshBody();

    // Player
    this.player = this.physics.add.sprite(400, 420, "player", "Kong-idle-right.png");
    this.player.setScale(1.09);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.7);
    this.player.setGravityY(3900);

    // Collisions
    this.physics.add.collider(this.player, this.platform, this.onPlatform, null, this);
   

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', () => {
      this.doJump();
    }, this);

    

    // Object dropping
    this.time.addEvent({
      delay: 1500,
      callback: this.dropObject,
      callbackScope: this,
      loop: true
    });

    // UI
    this.bananaText = this.add.text(100, 25, '0', { fontSize: '60px', fill: '#fff', fontWeight: "bold" });
    this.add.image(70, 50, "barrel").setScale(0.5);
    this.livesImages = [];
    this.updateLivesUI(); 

    // Increase difficulty over time
    this.time.addEvent({
      delay: 2000, 
      callback: () => {
        this.objectFallSpeed += 20;
      },
      loop: true
    });

    this.createAnimations();
  }

  update() {
    // Mouse movement
    const mouseX = this.input.mousePointer.x;
    const speed = 0.14; // Adjust how quickly player follows mouse
    const newX = this.player.x + (mouseX - this.player.x) * speed;

    if (Math.abs(newX - this.player.x) > 1) {
      // Player movement based on mouse position
      if (this.isOnPlatform) {
        if (newX > this.player.x) {
          this.player.anims.play('Kong-run-right', true);
        } else {
          this.player.anims.play('Kong-run-left', true);
        }
      }
    } else {
      // Idle animation based on direction
      if (this.isOnPlatform) {
        if (this.player.flipX) {
          this.player.anims.play('Kong-idle-left', true);
        } else {
          this.player.anims.play('Kong-idle-right', true);
        }
      }
    }

    // Set the player's position
    this.player.x = newX;

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
      this.player.setVelocityY(-1150); // Jump velocity
      this.player.play("Kong-jump");
      this.isOnPlatform = false; // Reset platform flag
    }
  }

  dropObject() {
    const objects = ["rock", "coconut", "banana", "peach", "banana"];
    const randomObject = Phaser.Math.RND.pick(objects); // Randomly pick an object
    const x = Phaser.Math.Between(100, 700); // Random x position
    const y = -10; // Starting y position
    let object;

    // Create and handle different objects
    if (randomObject === "banana") {
      object = this.physics.add.image(x, y, randomObject);
      object.setScale(0.5).setGravityY(400);
      this.physics.add.collider(object, this.platform, (banana, platform) => {
        this.loseLife();
        banana.destroy();
      });
      this.physics.add.overlap(this.player, object, this.collectBanana, null, this);
    } else if (randomObject === "peach") {
      if (this.lives < this.initialLives) { // Drop peach only if lives are less than max
        object = this.physics.add.image(x, y, randomObject);
        object.setScale(0.3).setGravityY(100); // Scale and gravity
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
      object.setScale(0.4).setGravityY(550).setSize(30, 30); // Scale and gravity
      this.physics.add.collider(object, this.platform, (object, platform) => {
        if (randomObject === "rock") {
          object.setVelocity(150, -470); // Example direction right and up
        } else if (randomObject === "coconut") {
          object.setVelocity(-150, -470); // Example direction left and up
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
    
    this.bananasCollected++; // Increment banana count
    this.bananaText.setText(`${this.bananasCollected}`); // Update UI text
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
    this.objectFallSpeed = 300;
    this.lives = this.initialLives; // Reset lives
    this.gameMusic.stop(); // Stop music when game over
    this.scene.start("gameOver", { points: this.bananasCollected }) // Start game over scene
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
      const lifeImage = this.add.image(50 + i * 40, 110, 'banana-life');
      this.livesImages.push(lifeImage); // Store life images
    }
  }

  createAnimations() {
    this.anims.create({
      key: "Kong-jump",
      frames: [{ key: "player", frame: "Kong-jump.png" }]
    });

    this.anims.create({
      key: "Kong-idle-left",
      frames: [{ key: "player", frame: "Kong-idle-left.png" }]
    });

    this.anims.create({
      key: "Kong-idle-right",
      frames: [{ key: "player", frame: "Kong-idle-right.png" }]
    });

    this.anims.create({
      key: "Kong-run-left",
      frames: this.anims.generateFrameNames("player", { start: 1, end: 2, prefix: "Kong-run-left-", suffix: ".png" }),
      repeat: -1,
      frameRate: 10
    });

    this.anims.create({
      key: "Kong-run-right",
      frames: this.anims.generateFrameNames("player", { start: 1, end: 2, prefix: "Kong-run-right-", suffix: ".png" }),
      repeat: -1,
      frameRate: 10
    });
  }
}



