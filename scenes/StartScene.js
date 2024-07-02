export default class StartScene extends Phaser.Scene {
    constructor() {
      super("startScene");
    }
    preload () {
      this.load.image("start", "./public/assets/start.jpg")
      
    }
    create() {
      // Add background or other visual elements for the start scene
  
      this.add.text(400, 200, 'Banana Barrel', { fontSize: '80 px', fill: '#fff', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
      this.add.text(400, 400, 'Press any key to start', { fontSize: '30px', fill: '#fff', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
      this.add.image(400, 300, "start").setDepth(1).setScale(0.55)
      
      // Listen for keyboard events to start the game
      this.input.keyboard.on('keydown', () => {
        this.scene.start('game'); 
      });
    }
  }
  