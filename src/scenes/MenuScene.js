import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  init(data) {
    this.message = data && data.message;
  }

  create() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'CHENNAI MAARI', {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'Level 1: Marina Beach', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#ffe08a',
      })
      .setOrigin(0.5);

    if (this.message) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, this.message, {
          fontFamily: '"Press Start 2P"',
          fontSize: '10px',
          color: '#7cfc00',
        })
        .setOrigin(0.5);
    }

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, 'Press SPACE to start', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Level1Scene');
    });
  }
}
