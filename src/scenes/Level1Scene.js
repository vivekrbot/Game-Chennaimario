import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/constants.js';
import Maari from '../entities/Maari.js';
import AutoRickshaw from '../entities/AutoRickshaw.js';
import CoffeeCup from '../entities/CoffeeCup.js';
import TouchControls from '../ui/TouchControls.js';
import { addSound, playSound } from '../utils/audio.js';
import { track } from '../utils/analytics.js';
import { level1 } from '../data/levels.js';

const GROUND_Y = 344;
const TILE_SIZE = 32;
const FALL_DEATH_Y = 400;
const RICKSHAW_Y = GROUND_Y - 11;
const RICKSHAW_SPAWNS = [
  { x: 500, patrolRange: 200 },
  { x: 1100, patrolRange: 180 },
  { x: 1700, patrolRange: 150 },
  { x: 2400, patrolRange: 200 },
];
const FLAG_X = 3100;

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene');
  }

  create() {
    this.level = level1;
    this.levelComplete = false;
    this.physics.world.setBounds(0, 0, this.level.worldWidth, GAME_HEIGHT);

    this.buildBackground();
    this.buildTerrain();
    this.buildPlatforms();
    this.buildPalmTrees();
    this.buildFlag();

    this.buildRickshaws();
    this.buildCoffees();

    this.maari = new Maari(this, this.level.spawn.x, this.level.spawn.y);
    this.maari.setDepth(10);
    this.physics.add.collider(this.maari, this.ground);
    this.physics.add.collider(this.maari, this.platforms);
    this.physics.add.collider(
      this.maari,
      this.rickshaws,
      this.handleRickshawCollision,
      undefined,
      this
    );
    this.physics.add.overlap(this.maari, this.coffees, (maari, cup) => cup.collect());
    this.physics.add.overlap(this.maari, this.flag, () => this.handleLevelComplete(), undefined, this);

    this.cameras.main.setBounds(0, 0, this.level.worldWidth, GAME_HEIGHT);
    this.cameras.main.setDeadzone(100, 200);
    this.cameras.main.startFollow(this.maari);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.touchControls = new TouchControls();
    this.events.once('shutdown', () => {
      this.touchControls.destroy();
      if (this.bgm) this.bgm.stop();
    });

    this.events.on('maari:died', () => {
      this.time.delayedCall(800, () => this.respawnMaari());
    });

    this.scene.stop('HUDScene');
    this.scene.launch('HUDScene');

    this.bgm = addSound(this, 'bgm-beach', { loop: true, volume: 0.4 });
    if (this.bgm) this.bgm.play();

    track('level_started', { level: 'marina-beach' });
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

  buildFlag() {
    this.flag = this.physics.add.staticImage(FLAG_X, GROUND_Y, 'flag').setOrigin(0.5, 1);
  }

  buildRickshaws() {
    this.rickshaws = this.physics.add.group();
    for (const { x, patrolRange } of RICKSHAW_SPAWNS) {
      this.rickshaws.add(new AutoRickshaw(this, x, RICKSHAW_Y, patrolRange));
    }
    this.physics.add.collider(this.rickshaws, this.ground);
  }

  buildCoffees() {
    this.coffees = this.physics.add.group();
    for (const [x, y] of this.level.coffees) {
      this.coffees.add(new CoffeeCup(this, x, y));
    }
  }

  handleRickshawCollision(maari, rickshaw) {
    if (maari.body.velocity.y > 0 && maari.y < rickshaw.y - 4) {
      rickshaw.defeat();
      maari.stomp();
      this.events.emit('maari:stomped-enemy');
    } else {
      maari.die('enemy');
    }
  }

  handleLevelComplete() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.maari.setVelocity(0, 0);
    this.maari.body.moves = false;
    playSound(this, 'win');
    if (this.bgm) this.bgm.stop();
    this.events.emit('level:complete');
  }

  respawnMaari() {
    this.maari.body.enable = true;
    this.maari.setPosition(this.level.spawn.x, this.level.spawn.y);
    this.maari.setVelocity(0, 0);
    this.maari.setAngle(0);
    this.maari.setAlpha(1);
  }

  update() {
    if (this.levelComplete) return;

    this.maari.update(this.cursors, this.touchControls.getInput());

    if (this.maari.body.enable && this.maari.y > FALL_DEATH_Y) {
      this.maari.die('fall');
    }

    this.rickshaws.getChildren().forEach((rickshaw) => rickshaw.update());
  }
}
