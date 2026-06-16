import Phaser from 'phaser';
import { PLAYER_SPEED, JUMP_VELOCITY } from '../utils/constants.js';
import { playSound } from '../utils/audio.js';

export default class Maari extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'maari');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(12, 22);
    this.setBounce(0.05);

    this.facing = 'right';
    this.isJumping = false;
    this.isStomping = false;

    this.wasd = scene.input.keyboard.addKeys('W,A,S,D');
  }

  update(cursors, touchInput = {}) {
    const left =
      (cursors && cursors.left.isDown) || this.wasd.A.isDown || touchInput.left;
    const right =
      (cursors && cursors.right.isDown) || this.wasd.D.isDown || touchInput.right;
    const jump =
      (cursors && cursors.up.isDown) || this.wasd.W.isDown || touchInput.jump;

    if (left) {
      this.setVelocityX(-PLAYER_SPEED);
      this.facing = 'left';
      this.setFlipX(true);
    } else if (right) {
      this.setVelocityX(PLAYER_SPEED);
      this.facing = 'right';
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (jump && this.body.blocked.down) {
      this.setVelocityY(JUMP_VELOCITY);
      this.isJumping = true;
      playSound(this.scene, 'jump');
    }

    if (this.body.blocked.down) {
      this.isJumping = false;
    }
  }

  die(cause = 'enemy') {
    this.body.enable = false;
    this.setVelocity(0, -200);
    this.setAngularVelocity(0);
    this.scene.tweens.add({
      targets: this,
      angle: 90,
      alpha: 0,
      duration: 500,
    });
    playSound(this.scene, 'hurt');
    this.scene.cameras.main.shake(200, 0.005);
    this.scene.events.emit('maari:died', { x: this.x, cause });
  }

  stomp() {
    this.isStomping = true;
    this.setVelocityY(-300);
  }
}
