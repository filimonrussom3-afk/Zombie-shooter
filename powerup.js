class PowerUp {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.speed = 2;

    this.types = ["life", "double", "fast"];
    this.type = random(this.types);

    this.emoji =
      this.type === "life" ? "❤️" :
      this.type === "double" ? "✂️" :
      "⚡";
  }

  update() {
    this.y += this.speed;
  }

  show() {
    push();
    textAlign(CENTER, CENTER);
    textSize(22);

    drawingContext.shadowBlur = 16;
    drawingContext.shadowColor =
      this.type === "life" ? "red" :
      this.type === "double" ? "yellow" :
      "cyan";

    text(this.emoji, this.x, this.y);

    drawingContext.shadowBlur = 0;
    pop();
  }
}