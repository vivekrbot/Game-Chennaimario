import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  parent: 'game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene],
};

new Phaser.Game(config);
