import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/constants.js';
import Maari from '../entities/Maari.js';
import { level1 } from '../data/levels.js';

const GROUND_Y = 344;
const TILE_SIZE = 32;
const FALL_DEATH_Y = 400;

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    this.level = level1;
    this.physics.world.setBounds(0, 0, this.level.worldWidth, GAME_HEIGHT);

    this.buildBackground();
    this.buildTerrain();
    this.buildPlatforms();
    this.buildPalmTrees();

    this.maari = new Maari(this, this.level.spawn.x, this.level.spawn.y);
    this.maari.setDepth(10);
    this.physics.add.collider(this.maari, this.ground);
    this.physics.add.collider(this.maari, this.platforms);

    this.cameras.main.setBounds(0, 0, this.level.worldWidth, GAME_HEIGHT);
    this.cameras.main.setDeadzone(100, 200);
    this.cameras.main.startFollow(this.maari);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.events.on('maari:died', () => {
      this.time.delayedCall(800, () => this.respawnMaari());
    });
  }

  buildBackground() {
    const skyBandColors = [0xffd89b, 0xffc795, 0xffb38a, 0xff9e6e];
    const bandHeight = GAME_HEIGHT / skyBandColors.length;
    const sky = this.add.graphics().setScrollFactor(0).setDepth(-100);
    skyBandColors.forEach((color, i) => {
      sky.fillStyle(color, 1);
      sky.fillRect(0, bandHeight * i, GAME_WIDTH, bandHeight);
    });

    const sun = this.add.graphics().setScrollFactor(0).setDepth(-90);
    sun.fillStyle(COLORS.sun, 1);
    sun.fillCircle(GAME_WIDTH - 70, 60, 35);

    const cloudCount = 7;
    for (let i = 0; i < cloudCount; i++) {
      const x = (i / cloudCount) * this.level.worldWidth + Phaser.Math.Between(-40, 40);
      const y = Phaser.Math.Between(30, 120);
      this.add.image(x, y, 'cloud').setScrollFactor(0.5).setDepth(-80);
    }

    const sea = this.add.graphics().setDepth(-70);
    sea.fillStyle(COLORS.sea, 1);
    sea.fillRect(0, GAME_HEIGHT - 60, this.level.worldWidth, 60);
  }

  buildTerrain() {
    this.ground = this.physics.add.staticGroup();
    for (const [start, end] of this.level.segments) {
      for (let x = start; x < end; x += TILE_SIZE) {
        this.ground.create(x + TILE_SIZE / 2, GROUND_Y + TILE_SIZE / 2, 'sand-tile');
      }
    }
  }

  buildPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    for (const [x, y] of this.level.platforms) {
      this.platforms.create(x, y, 'stone-platform');
    }
  }

  buildPalmTrees() {
    for (const x of this.level.palmTrees) {
      this.add.image(x, GROUND_Y, 'palm-tree').setOrigin(0.5, 1).setDepth(-10);
    }
  }

  respawnMaari() {
    this.maari.body.enable = true;
    this.maari.setPosition(this.level.spawn.x, this.level.spawn.y);
    this.maari.setVelocity(0, 0);
    this.maari.setAngle(0);
    this.maari.setAlpha(1);
  }

  update() {
    this.maari.update(this.cursors);

    if (this.maari.body.enable && this.maari.y > FALL_DEATH_Y) {
      this.maari.die();
    }
  }
}
