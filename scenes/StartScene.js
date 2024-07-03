export default class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
  }
  preload () {
    this.load.image("start", "./public/assets/start.jpg")
    
  }
  create() {
    // Add background or other visual elements for the start scene

    this.add.text(400, 220, 'Banana Barrel', { fontSize: '80px', fill: '#fff', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
    this.add.text(400, 450, 'Press click to start', { fontSize: '30px', fill: '#fff', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
    this.add.image(400, 300, "start").setDepth(1).setScale(0.55)
    const startButton = this.add.image(this.scale.width / 2, this.scale.height / 1.7, "start").setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('game')
    })
  }
}
