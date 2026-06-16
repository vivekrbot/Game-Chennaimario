import Phaser from 'phaser';
import { playSound } from '../utils/audio.js';

export default class CoffeeCup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coffee-cup');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);

    scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  collect() {
    playSound(this.scene, 'coffee');
    this.scene.events.emit('coffee:collected', 10);
    this.destroy();
  }
}
