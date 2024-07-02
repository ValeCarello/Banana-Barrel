import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";
import StartScene from "./scenes/StartScene.js"; 

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [StartScene, Game, GameOver],
};

window.game = new Phaser.Game(config);
