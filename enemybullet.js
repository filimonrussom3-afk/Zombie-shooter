class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.y += 4;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(14);

    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = "red";

    text("☠️", this.x, this.y);

    drawingContext.shadowBlur = 0;
    pop();
  }
}