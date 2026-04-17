class BossZombie {
  constructor() {
    this.x = width / 2;
    this.y = 100;
    this.speed = 1.5;
    this.direction = 1;
    this.health = 10;
    this.maxHealth = 10;

    this.shootCooldown = 30;
    this.size = 60;
    this.emoji = "👹";
  }

  update() {
    this.x += this.speed * this.direction;

    if (this.x < 50 || this.x > width - 50) {
      this.direction *= -1;
    }

    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  shoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = 20;
      return true;
    }
    return false;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(this.size);

    drawingContext.shadowBlur = 24;
    drawingContext.shadowColor = "purple";

    text(this.emoji, this.x, this.y);

    // Draw health bar
    fill(200, 0, 0);
    rect(this.x - 30, this.y + 50, 60, 8);

    fill(0, 255, 0);
    let healthWidth = (this.health / this.maxHealth) * 60;
    rect(this.x - 30, this.y + 50, healthWidth, 8);

    drawingContext.shadowBlur = 0;
    pop();
  }
}
