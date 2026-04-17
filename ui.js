function drawUI() {
  push();
  textAlign(CENTER, CENTER);

  fill(255);
  textSize(14);

  text(`P1 ❤️ ${p1.lives} | Score ${p1.score}`, 150, 25);

  if (gameMode === 2) {
    text(`P2 ❤️ ${p2.lives} | Score ${p2.score}`, width - 150, 25);
  }

  text(`Level ${level} | Zombies ${zombiesKilled}/${zombiesToKill}`, width / 2, 25);

  pop();
}