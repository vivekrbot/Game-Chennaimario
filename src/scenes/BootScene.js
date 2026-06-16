import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/constants.js';

const SPRITES = {
  maari: { width: 16, height: 24 },
  'auto-rickshaw': { width: 28, height: 22 },
  'coffee-cup': { width: 14, height: 16 },
  'sand-tile': { width: 32, height: 32 },
  'stone-platform': { width: 32, height: 16 },
  flag: { width: 20, height: 48 },
  'palm-tree': { width: 32, height: 64 },
  cloud: { width: 48, height: 20 },
};

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.failedKeys = new Set();
  }

  preload() {
    const barWidth = 320;
    const barHeight = 24;
    const x = (GAME_WIDTH - barWidth) / 2;
    const y = (GAME_HEIGHT - barHeight) / 2;

    const boxGraphics = this.add.graphics();
    boxGraphics.fillStyle(0x222222, 1);
    boxGraphics.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);

    const barGraphics = this.add.graphics();

    this.load.on('progress', (value) => {
      barGraphics.clear();
      barGraphics.fillStyle(COLORS.saffron, 1);
      barGraphics.fillRect(x, y, barWidth * value, barHeight);
    });

    this.load.on('loaderror', (file) => {
      this.failedKeys.add(file.key);
    });

    for (const key of Object.keys(SPRITES)) {
      this.load.image(key, `assets/sprites/${key}.png`);
    }
  }

  create() {
    for (const [key, { width, height }] of Object.entries(SPRITES)) {
      if (!this.textures.exists(key) || this.failedKeys.has(key)) {
        this.generatePlaceholder(key, width, height);
      }
    }

    this.scene.start('MenuScene');
  }

  generatePlaceholder(key, width, height) {
    const graphics = this.add.graphics();
    const color = this.placeholderColor(key);
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.lineStyle(1, 0x000000, 0.4);
    graphics.strokeRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  placeholderColor(key) {
    switch (key) {
      case 'maari':
        return COLORS.maari;
      case 'auto-rickshaw':
        return COLORS.rickshaw;
      case 'coffee-cup':
        return COLORS.coffee;
      case 'sand-tile':
        return COLORS.sand;
      case 'stone-platform':
        return COLORS.stone;
      case 'flag':
        return COLORS.flag;
      case 'palm-tree':
        return COLORS.palmLeaf;
      case 'cloud':
        return COLORS.cloud;
      default:
        return 0xffffff;
    }
  }
}
