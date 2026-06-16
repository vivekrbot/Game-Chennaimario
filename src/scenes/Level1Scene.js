import Phaser from 'phaser';
import { GAME_HEIGHT } from '../utils/constants.js';
import Maari from '../entities/Maari.js';

const WORLD_WIDTH = 3200;
const GROUND_Y = 344;
const TILE_SIZE = 32;

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);

    this.ground = this.physics.add.staticGroup();
    for (let x = 0; x < WORLD_WIDTH; x += TILE_SIZE) {
      this.ground.create(x + TILE_SIZE / 2, GROUND_Y + TILE_SIZE / 2, 'sand-tile');
    }

    this.maari = new Maari(this, 50, 280);
    this.physics.add.collider(this.maari, this.ground);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.setDeadzone(100, 200);
    this.cameras.main.startFollow(this.maari);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.maari.update(this.cursors);
  }
}
