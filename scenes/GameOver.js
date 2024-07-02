export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    create() {
      // Display game over text or image
      this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
  
      // Add a restart button or any other UI elements
      this.add.text(400, 400, 'Click to Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
      
      // Restart the game when the player clicks anywhere
      this.input.on('pointerdown', () => {
        this.scene.start('game'); 
      });
    }
  }