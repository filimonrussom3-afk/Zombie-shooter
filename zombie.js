class Zombie {
  constructor() {
    this.x = random(width);
    this.y = random(50, 150);
    this.speed = random(1.5, 2.5 + level * 0.1);
    this.direction = random([1, -1]);
    this.health = 1;

    this.shootCooldown = random(60, 120);

    this.types = ["🧟", "🧟‍♂️", "🧟‍♀️", "💀", "👻"];
    this.emoji = random(this.types);
    this.size = random(25, 40);
  }

  update() {
    this.x += this.speed * this.direction;
    this.y += sin(frameCount * 0.02) * 0.5;

    if (this.x < 20 || this.x > width - 20) {
      this.direction *= -1;
    }

    this.y = constrain(this.y, 30, 200);

    if (this.shootCooldown > 0) this.shootCooldown--;
  }

  shoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = random(60, 120);
      return true;
    }
    return false;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(this.size);

    drawingContext.shadowBlur = 18;
    drawingContext.shadowColor = "lime";

    text(this.emoji, this.x, this.y);

    drawingContext.shadowBlur = 0;
    pop();
  }
}