import Phaser from 'phaser';
import ScoreDisplay from '../ui/ScoreDisplay.js';
import { track } from '../utils/analytics.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');
  }

  create() {
    this.scoreDisplay = new ScoreDisplay(this);
    this.buildMuteButton();
    this.deaths = 0;
    this.startTime = this.time.now;

    const level = this.scene.get('Level1Scene');

    level.events.on('coffee:collected', (value) => {
      this.scoreDisplay.addCoffee();
      this.scoreDisplay.addScore(value);
      track('coffee_collected', { totalThisRun: this.scoreDisplay.coffeeCount });
    });

    level.events.on('maari:died', (data) => {
      this.deaths += 1;
      track('maari_died', { x: data && data.x, cause: data && data.cause });

      const remaining = this.scoreDisplay.loseLife();
      if (remaining <= 0) {
        this.scene.stop('Level1Scene');
        this.scene.stop('HUDScene');
        this.scene.start('GameOverScene', { score: this.scoreDisplay.score });
      }
    });

    level.events.on('maari:stomped-enemy', () => {
      this.scoreDisplay.addScore(50);
    });

    level.events.on('level:complete', () => {
      this.scoreDisplay.addScore(500);
      track('level_completed', {
        level: 'marina-beach',
        score: this.scoreDisplay.score,
        time: Math.round((this.time.now - this.startTime) / 1000),
        deaths: this.deaths,
      });
      this.scene.stop('Level1Scene');
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene', { message: 'Level 1 cleared — Vanakkam!' });
    });
  }

  buildMuteButton() {
    const muteButton = this.add
      .text(this.scale.width - 12, 28, this.sound.mute ? '🔇' : '🔊', { fontSize: '14px' })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    muteButton.on('pointerdown', () => {
      this.sound.mute = !this.sound.mute;
      muteButton.setText(this.sound.mute ? '🔇' : '🔊');
    });
  }
}
