import Phaser from 'phaser';
import { playSound } from '../utils/audio.js';

export default class AutoRickshaw extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, patrolRange) {
    super(scene, x, y, 'auto-rickshaw');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.spawnX = x;
    this.patrolRange = patrolRange;
    this.speed = 50;
    this.direction = 1;
  }

  update() {
    if (this.x >= this.spawnX + this.patrolRange) {
      this.direction = -1;
    } else if (this.x <= this.spawnX - this.patrolRange) {
      this.direction = 1;
    }
    this.setVelocityX(this.speed * this.direction);
    this.setFlipX(this.direction < 0);
  }

  defeat() {
    playSound(this.scene, 'stomp');

    if (!this.scene.textures.exists('spark')) {
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(0xffffff, 1);
      graphics.fillCircle(2, 2, 2);
      graphics.generateTexture('spark', 4, 4);
      graphics.destroy();
    }

    const emitter = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 40, max: 100 },
      lifespan: 250,
      scale: { start: 1, end: 0 },
      quantity: 8,
    });
    this.scene.time.delayedCall(300, () => emitter.destroy());

    this.destroy();
  }
}
