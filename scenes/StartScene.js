export default class StartScene extends Phaser.Scene {
    constructor() {
      super("startScene");
    }
  
    create() {
      // Add background or other visual elements for the start scene
      this.add.text(400, 300, 'Welcome to Banana Barrel', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
      this.add.text(400, 400, 'Press any key to start', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  
      // Listen for keyboard events to start the game
      this.input.keyboard.on('keydown', () => {
        this.scene.start('game'); // Start the game scene when any key is pressed
      });
    }
  }
  