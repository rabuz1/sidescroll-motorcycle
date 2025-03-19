// UI module
const UI = (function () {
  // UI elements
  let startBtn;
  let restartBtn;
  let scoreValue;
  let finalScore;
  let gameOverScreen;

  // Initialize UI
  function init() {
    startBtn = document.getElementById("start-btn");
    restartBtn = document.getElementById("restart-btn");
    scoreValue = document.getElementById("score-value");
    finalScore = document.getElementById("final-score");
    gameOverScreen = document.getElementById("game-over");

    // Add event listeners - using a callback approach to avoid circular dependency
    startBtn.addEventListener("click", function () {
      if (typeof Game !== "undefined" && Game.start) {
        Game.start();
      }
    });

    restartBtn.addEventListener("click", function () {
      if (typeof Game !== "undefined" && Game.start) {
        Game.start();
      }
    });
  }

  // Update score display
  function updateScore(score) {
    scoreValue.textContent = Math.floor(score);
  }

  // Show game over screen
  function showGameOver(score) {
    finalScore.textContent = Math.floor(score);
    gameOverScreen.style.display = "block";
    startBtn.textContent = "Start Game";
  }

  // Hide game over screen
  function hideGameOver() {
    gameOverScreen.style.display = "none";
    startBtn.textContent = "Restart";
  }

  // Public API
  return {
    init,
    updateScore,
    showGameOver,
    hideGameOver,
  };
})();
