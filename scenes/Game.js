// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");

    // Variable to count collected bananas
    this.bananasCollected = 0;
  }

  preload() {
    // Load assets (images and spritesheets)
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
    // Create background and platforms
    this.background = this.add.image(400, 300, "background");
    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "platform").setScale(1.9).refreshBody();

    // Create player sprite from atlas
    this.player = this.physics.add.sprite(128, 128, "player", "adventurer-idle-00.png");
    this.player.setScale(3);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.7);

    // Set specific gravity for the player
    this.player.setGravityY(850);

    // Enable world bounds collision
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Set up collisions
    this.physics.add.collider(this.player, this.platform, this.onPlatform, null, this);
    this.physics.add.collider(this.player, this.physics.world.bounds, this.playerHitWorldBounds, null, this);

    // Set up input handling
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', function(pointer) {
      if (pointer.leftButtonDown()) {
        this.doJump();
      }
    }, this);

    // Flag to track if the player is on a platform
    this.isOnPlatform = false;

    // Call the function to drop objects every certain interval
    this.time.addEvent({
      delay: 2000,  // Time interval between each object drop (in milliseconds)
      callback: this.dropObject,
      callbackScope: this,
      loop: true   // Repeat continuously
    });

    // Create text for the bananas counter
    this.bananaText = this.add.text(10, 10, 'Bananas: 0', { fontSize: '24px', fill: '#ffffff' });
  
     // Detectar colisión con objetos que causan Game Over
     this.physics.add.collider(this.player, [this.coconutObjects, this.rockObjects, this.pineappleObjects], this.gameOver, null, this);
  
  }

  dropObject() {
    const objects = ["rock", "coconut", "pineapple", "banana", "peach"];
    const randomObject = Phaser.Math.RND.pick(objects);
    const x = Phaser.Math.Between(100, 700);
    const y = -50;
    let object;

    if (randomObject === "banana") {
      object = this.physics.add.image(x, y, randomObject);
      object.setScale(0.15).setGravityY(300);

      // Collider solo con la plataforma
      this.physics.add.collider(object, this.platform);

      // Recolectar banana al tocarla
      this.physics.add.overlap(this.player, object, this.collectBanana, null, this);
    } else {
      object = this.physics.add.image(x, y, randomObject);
      object.setScale(0.15).setGravityY(300);

      // Set collision with the platform
      this.physics.add.collider(object, this.platform, (object, platform) => {
        // Set horizontal velocity based on the desired direction
        if (randomObject === "rock") {
          object.setVelocity(150, -250); // Example direction right and up
        } else if (randomObject === "coconut") {
          object.setVelocity(-150, -250); // Example direction left and up
        } else if (randomObject === "pineapple") {
          object.setVelocity(150, -250); // Example direction right and up
        }
      });
    }
  }
  // Función para mostrar la escena de Game Over
  gameOver() {
    this.scene.start("gameOver");
  }

  update() {
    // Player movement based on keyboard input
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Make player follow horizontal mouse movement gradually
    const mouseX = this.input.mousePointer.x;
    const speed = 0.05; // Adjust this value to change how slowly the player follows the mouse
    this.player.x = Phaser.Math.Interpolation.Linear([this.player.x, mouseX], speed);

    // Ensure player stays within platform bounds if on a platform
    if (this.isOnPlatform) {
      this.keepPlayerOnPlatform();
    }
  }

  // Function to keep player on the platform
  keepPlayerOnPlatform() {
    const platform = this.platform.children.entries[0];
    const platformLeftEdge = platform.x - (platform.displayWidth / 2) + 40;
    const platformRightEdge = platform.x + (platform.displayWidth / 2) - 40;

    if (this.player.x < platformLeftEdge) {
      this.player.x = platformLeftEdge;
      this.player.setVelocityX(0);
    } else if (this.player.x > platformRightEdge) {
      this.player.x = platformRightEdge;
      this.player.setVelocityX(0);
    }
  }

  // Collider callback to set the flag when the player is on the platform
  onPlatform(player, platform) {
    this.isOnPlatform = true;
    player.body.touching.down = true;
  }

  // Jump function
  doJump() {
    if (this.player.body.touching.down || this.player.body.onFloor()) {
      this.player.setVelocityY(-500);
      this.isOnPlatform = false; // Reset the flag when the player jumps
    }
  }

  // Function called when player hits world bounds
  playerHitWorldBounds() {
    // Handle what happens when player hits the world bounds
  }

  // Function called when player collects a banana
  collectBanana(player, banana) {
    banana.disableBody(true, true); // Disables physics and hides the banana

    // Increment collected bananas counter
    this.bananasCollected++;

    // Update the counter text on the screen
    this.bananaText.setText(`Bananas: ${this.bananasCollected}`);

    // Destroy the banana from the game
    banana.destroy();
  }
}


