// main.js

import Game from "./scenes/Game.js";
import GameOver from "./scenes/GameOver.js";
import StartScene from "./scenes/StartScene.js"; // Import the new scene

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
      debug: true,
    },
  },
  scene: [StartScene, Game, GameOver], // Add StartScene as the first scene to load
};

window.game = new Phaser.Game(config);
