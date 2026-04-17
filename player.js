class Player {
  constructor(x, emoji) {
    this.x = x;
    this.y = height - 50;
    this.emoji = emoji;

    this.score = 0;
    this.lives = 3;

    this.doubleGun = false;
    this.fastGun = false;
    this.cooldown = 0;
  }

  update() {
    let speed = 6;

    if (this === p1) {
      // P1: A/D keys always work, plus arrow keys and W in single player mode
      if (keyIsDown(65)) this.x -= speed; // A
      if (keyIsDown(68)) this.x += speed; // D

      // In single player mode, also allow arrow keys for P1
      if (gameMode === 1) {
        if (keyIsDown(LEFT_ARROW)) this.x -= speed;
        if (keyIsDown(RIGHT_ARROW)) this.x += speed;
      }
    }

    if (this === p2) {
      if (keyIsDown(LEFT_ARROW)) this.x -= speed;
      if (keyIsDown(RIGHT_ARROW)) this.x += speed;
    }

    this.x = constrain(this.x, 0, width);

    if (this.cooldown > 0) this.cooldown--;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(40);

    drawingContext.shadowBlur = 18;
    drawingContext.shadowColor = "cyan";

    fill(255);
    text(this.emoji, this.x, this.y);

    drawingContext.shadowBlur = 0;
    pop();
  }

  shoot() {
    if (this.cooldown <= 0) {
      bullets.push(new Bullet(this.x, this.y - 20, this));

      if (this.doubleGun) {
        bullets.push(new Bullet(this.x - 10, this.y - 20, this));
        bullets.push(new Bullet(this.x + 10, this.y - 20, this));
      }

      audio.shoot();

      this.cooldown = this.fastGun ? 5 : 15;
    }
  }
}