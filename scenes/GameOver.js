export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
    init(data) {
      this.points = data.points; // Guarda los puntos recibidos
    }
    preload() {
      this.load.image("backgaroundgameover", "./public/assets/backgroundgameover.png")
      this.load.audio('gameoverMusic', ['./public/audio/gameover_music.mp3', './public/audio/gameover_music.ogg']);
    }
    create() {

        // Play music for Game
        this.add.image(400, 300, "backgaroundgameover")
    this.gameoverMusic = this.sound.add('gameoverMusic', { loop: true });
    this.gameoverMusic.volume = 0.5;
    this.gameoverMusic.play();
      // Display game over text or image
      this.add.text(400, 200, 'GAME OVER', { fontSize: '60px', fill: '#00' }).setOrigin(0.5);
      // view points
      this.add.text(420, 300, `POINTS: ${this.points}`, { fontSize: '32px', fill: '#00' }).setOrigin(0.5);

      // Add a restart button or any other UI elements
      this.add.text(400, 400, 'Click to Restart', { fontSize: '24px', fill: '#00' }).setOrigin(0.5);
      
      // Restart the game when the player clicks anywhere
      this.input.on('pointerdown', () => {
        this.scene.start('game'); 
        this.gameoverMusic.stop();
      });
    }
  }