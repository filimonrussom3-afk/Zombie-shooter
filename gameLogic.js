// Game variables
let p1, p2;
let gameMode = 1; // 1 for single player, 2 for two players
let bullets = [];
let enemyBullets = [];
let zombies = [];
let powerUps = [];
let level = 1;
let zombiesKilled = 0;
let zombiesToKill = 5;
let showMenuOverlay = false;

// Initialize the game
function initGame() {
  p1 = new Player(width / 4, "🧙");
  p2 = new Player((3 * width) / 4, "👺");

  bullets = [];
  enemyBullets = [];
  zombies = [];
  powerUps = [];
  level = 1;
  zombiesKilled = 0;
  zombiesToKill = 5;
  showMenuOverlay = false;
  for (let i = 0; i < zombiesToKill; i++) {
    zombies.push(new Zombie());
  }

  gameState = "playing";
  
  // Start background music when game begins
  audio.playBackgroundMusic();
}

// Setup start screen
function setupStartScreen() {
  let singleBtn = document.getElementById("htmlSingleBtn");
  let multiBtn = document.getElementById("htmlMultiBtn");

  singleBtn.addEventListener("click", () => {
    gameMode = 1;
    document.getElementById("startOverlay").classList.add("hidden");
    initGame();
  });

  multiBtn.addEventListener("click", () => {
    gameMode = 2;
    document.getElementById("startOverlay").classList.add("hidden");
    initGame();
  });
}

// Main game drawing and update logic
function drawGame() {
  if (gameState === "start") {
    return;
  }

  if (gameState === "gameOver") {
    drawGameOver();
    return;
  }

  // Update player
  p1.update();
  if (gameMode === 2) {
    p2.update();
  }

  // Handle continuous shooting
  if (gameMode === 1) {
    // Single player: spacebar
    if (keyIsDown(32)) {
      p1.shoot();
    }
  } else if (gameMode === 2) {
    // Two players: P1 uses W key (87), P2 uses Up Arrow
    if (keyIsDown(87)) {
        p1.shoot();
      }
      if (keyIsDown(UP_ARROW)) {
        p2.shoot();
      }
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      bullets[i].show();

      // Remove bullets that go off screen
      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
      }
    }

    // Update and draw enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      enemyBullets[i].update();
      enemyBullets[i].show();

      // Check collision with players
      let d1 = dist(enemyBullets[i].x, enemyBullets[i].y, p1.x, p1.y);
      if (d1 < 30) {
        p1.lives--;
        audio.damage();
        enemyBullets.splice(i, 1);
        if (p1.lives <= 0) {
          gameState = "gameOver";
          audio.stopBackgroundMusic();
          audio.gameEnd();
        }
        continue;
      }

      if (gameMode === 2) {
        let d2 = dist(enemyBullets[i].x, enemyBullets[i].y, p2.x, p2.y);
        if (d2 < 30) {
          p2.lives--;
          audio.damage();
          enemyBullets.splice(i, 1);
          if (p2.lives <= 0) {
            gameState = "gameOver";
            audio.stopBackgroundMusic();
            audio.gameEnd();
          }
          continue;
        }
      }

      // Remove enemy bullets that go off screen
      if (enemyBullets[i].y > height) {
        enemyBullets.splice(i, 1);
      }
    }

    // Update and draw zombies
    for (let i = zombies.length - 1; i >= 0; i--) {
      zombies[i].update();
      zombies[i].show();

      // Zombie shoots
      if (zombies[i].shoot()) {
        enemyBullets.push(new EnemyBullet(zombies[i].x, zombies[i].y));
        audio.enemyShoot();
      }

      // Check collision with bullets
      for (let j = bullets.length - 1; j >= 0; j--) {
        let d = dist(bullets[j].x, bullets[j].y, zombies[i].x, zombies[i].y);
        if (d < 30) {
          zombies[i].health--;
          audio.hit();
          bullets.splice(j, 1);

          if (zombies[i].health <= 0) {
            let score = level * 10;
            p1.score += score;
            if (gameMode === 2) {
              p2.score += score;
            }
            zombiesKilled++;

            // Chance to spawn powerup
            if (random() < 0.3) {
              powerUps.push(new PowerUp());
            }

            zombies.splice(i, 1);
            spawnNewZombie();
          }
          break;
        }
      }
    }

  // Update and draw power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
    powerUps[i].show();

    // Check collision with player 1
    let d1 = dist(powerUps[i].x, powerUps[i].y, p1.x, p1.y);
    if (d1 < 30) {
      audio.powerUp();
      applyPowerUp(p1, powerUps[i].type);
      powerUps.splice(i, 1);
      continue;
    }

    // Check collision with player 2
    if (gameMode === 2) {
      let d2 = dist(powerUps[i].x, powerUps[i].y, p2.x, p2.y);
      if (d2 < 30) {
        audio.powerUp();
        applyPowerUp(p2, powerUps[i].type);
        powerUps.splice(i, 1);
        continue;
      }
    }

    // Remove power-ups that go off screen
    if (powerUps[i].y > height) {
      powerUps.splice(i, 1);
    }
  }

    // Check if level is complete
    if (zombiesKilled >= zombiesToKill) {
      levelUp();
    }

  // Draw players
  p1.show();
  if (gameMode === 2) {
    p2.show();
  }

  // Draw menu button
  drawMenuButton();

  // Draw UI
  drawUI();

  // Draw menu overlay
  if (showMenuOverlay) {
    drawMenuOverlay();
  }
}

// Spawn a new zombie
function spawnNewZombie() {
  if (zombiesKilled < zombiesToKill) {
    zombies.push(new Zombie());
  }
}

// Apply power-up effect
function applyPowerUp(player, type) {
  if (type === "life") {
    player.lives++;
  } else if (type === "double") {
    player.doubleGun = true;
    setTimeout(() => {
      player.doubleGun = false;
    }, 5000);
  } else if (type === "fast") {
    player.fastGun = true;
    setTimeout(() => {
      player.fastGun = false;
    }, 5000);
  }
}

// Level up
function levelUp() {
  audio.levelUp();
  level++;
  zombiesKilled = 0;
  zombiesToKill = 5 + level * 2;
  zombies = [];
  enemyBullets = [];

  for (let i = 0; i < max(3, level); i++) {
    zombies.push(new Zombie());
  }
}

// Draw game over screen
function drawGameOver() {
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  fill(255, 0, 0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 60);

  fill(255);
  textSize(32);
  text(`Final Level: ${level}`, width / 2, height / 2 + 40);

  if (gameMode === 1) {
    text(`Score: ${p1.score}`, width / 2, height / 2 + 100);
  } else {
    text(`P1 Score: ${p1.score}`, width / 2, height / 2 + 100);
    text(`P2 Score: ${p2.score}`, width / 2, height / 2 + 150);
  }

  textSize(24);
  text("Press R to Restart", width / 2, height / 2 + 240);
}

// Handle mouse clicks
function handleMouseClick() {
  // Button clicks are handled by event listeners on HTML buttons
}

// Handle keyboard input
function handleInput() {
  if (key === "r" || key === "R") {
    if (gameState === "gameOver") {
      document.getElementById("startOverlay").classList.remove("hidden");
      gameState = "start";
    }
  }

  if (key === "Escape") {
    if (gameState === "playing") {
      showMenuOverlay = !showMenuOverlay;
    }
  }
}

// Draw menu button at top left
function drawMenuButton() {
  push();
  fill(100, 150, 255);
  stroke(200, 200, 255);
  strokeWeight(2);
  rect(15, 15, 80, 40, 5);

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("MENU", 55, 35);
  pop();
}

// Draw menu overlay
function drawMenuOverlay() {
  // Darken background
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  // Menu box
  let menuWidth = 300;
  let menuHeight = 280;
  let menuX = width / 2 - menuWidth / 2;
  let menuY = height / 2 - menuHeight / 2;

  fill(40, 40, 60);
  stroke(100, 150, 255);
  strokeWeight(3);
  rect(menuX, menuY, menuWidth, menuHeight, 10);

  // Title
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("MENU", width / 2, menuY + 40);

  // Buttons
  drawMenuOption("Resume", menuY + 80, () => {
    showMenuOverlay = false;
  });

drawMenuOption("Restart", menuY + 130, () => {
    showMenuOverlay = false;
    initGame();
  });

  drawMenuOption("Main Menu", menuY + 180, () => {
    showMenuOverlay = false;
    document.getElementById("startOverlay").classList.remove("hidden");
    gameState = "start";
  });

  fill(180);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("Press ESC to close", width / 2, menuY + menuHeight - 20);
}

// Menu option button
function drawMenuOption(label, yPos, callback) {
  let optionWidth = 200;
  let optionX = width / 2 - optionWidth / 2;

  push();
  fill(80, 120, 200);
  stroke(150, 180, 255);
  strokeWeight(2);
  rect(optionX, yPos, optionWidth, 35, 5);

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(label, width / 2, yPos + 17);

  // Store for mouse click detection
  if (!window.menuButtons) window.menuButtons = [];
  window.menuButtons.push({
    x: optionX,
    y: yPos,
    w: optionWidth,
    h: 35,
    callback: callback
  });

  pop();
}
