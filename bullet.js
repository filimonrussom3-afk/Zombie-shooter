class Bullet {
  constructor(x, y, owner) {
    this.x = x;
    this.y = y;
    this.owner = owner;
  }

  update() {
    this.y -= 7;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(18);

    drawingContext.shadowBlur = 14;
    drawingContext.shadowColor = "orange";

    text("🔥", this.x, this.y);

    drawingContext.shadowBlur = 0;
    pop();
  }
}