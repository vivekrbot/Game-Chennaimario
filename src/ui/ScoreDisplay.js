const TEXT_STYLE = {
  fontFamily: '"Press Start 2P"',
  fontSize: '12px',
  color: '#ffffff',
};

export default class ScoreDisplay {
  constructor(scene) {
    this.score = 0;
    this.coffeeCount = 0;
    this.lives = 3;

    this.scoreText = scene.add.text(12, 10, this.formatScore(), TEXT_STYLE).setScrollFactor(0);
    this.coffeeText = scene.add
      .text(scene.scale.width / 2, 10, this.formatCoffee(), TEXT_STYLE)
      .setOrigin(0.5, 0)
      .setScrollFactor(0);
    this.livesText = scene.add
      .text(scene.scale.width - 12, 10, this.formatLives(), TEXT_STYLE)
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  addScore(amount) {
    this.score += amount;
    this.scoreText.setText(this.formatScore());
  }

  addCoffee() {
    this.coffeeCount += 1;
    this.coffeeText.setText(this.formatCoffee());
  }

  loseLife() {
    this.lives -= 1;
    this.livesText.setText(this.formatLives());
    return this.lives;
  }

  formatScore() {
    return `SCORE ${String(this.score).padStart(4, '0')}`;
  }

  formatCoffee() {
    return `COFFEE ×${this.coffeeCount}`;
  }

  formatLives() {
    return `LIVES ${'♥'.repeat(Math.max(this.lives, 0))}`;
  }
}
