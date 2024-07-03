export default class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
  }
  preload () {
    this.load.image("backgroundstart", "./public/assets/backgroundstart.png")
    this.load.audio('startgameMusic', ['./public/audio/startgame_music.mp3', './public/audio/startgame_music.ogg']);
    this.load.image("botton", "./public/assets/botton.png")
  }
  create() {
    // Add background or other visual elements for the start scene
      // Play music for Game
      this.startgameMusic = this.sound.add('startgameMusic', { loop: true });
      this.startgameMusic.volume = 0.5;
      this.startgameMusic.play();
      this.add.image(400, 300, "backgroundstart")
      this.add.text(400, 215, 'BANANA BARREL', { fontSize: '80px', fill: '#000', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
    this.add.text(400, 460, 'Press click to start', { fontSize: '30px', fill: '#fff', fontWeight: "bold" }).setOrigin(0.5).setDepth(2);
    
    const startButton = this.add.image(this.scale.width / 2, this.scale.height / 1.9, "botton").setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('game')
      this.startgameMusic.stop(); // Stop music 
    })
  }
}
