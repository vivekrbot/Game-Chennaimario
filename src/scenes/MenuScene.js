import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Press SPACE to start', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
  }
}
