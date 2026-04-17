let bg;
let gameState = "start";

function preload() {
  bg = loadImage("download.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("gameShell");
  textAlign(CENTER, CENTER);

  initGame();
  setupStartScreen();
}

function draw() {
  background(8, 8, 18);

  if (bg) {
    tint(255, 40);
    image(bg, 0, 0, width, height);
    noTint();
  }

  fill(0, 0, 0, 140);
  rect(0, 0, width, height);

  drawGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  handleMouseClick();

  // Check menu button clicks
  if (showMenuOverlay && window.menuButtons) {
    for (let button of window.menuButtons) {
      if (
        mouseX > button.x &&
        mouseX < button.x + button.w &&
        mouseY > button.y &&
        mouseY < button.y + button.h
      ) {
        button.callback();
        window.menuButtons = [];
        return false;
      }
    }
  }

  // Check menu button click
  if (gameState === "playing" && !showMenuOverlay) {
    if (mouseX > 15 && mouseX < 95 && mouseY > 15 && mouseY < 55) {
      showMenuOverlay = true;
      window.menuButtons = [];
      return false;
    }
  }
}

function keyPressed() {
  handleInput();
}