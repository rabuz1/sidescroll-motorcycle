// Main game module
const Game = (function () {
  // Game variables
  let obstacles = [];
  let score = 0;
  let gameSpeed = 5;
  let isGameRunning = false;
  let gameArea;
  let isOffPath = false;

  // Initialize the game
  function init() {
    gameArea = document.querySelector(".game-area");

    // Initialize all modules
    InputHandler.init();
    Player.init();
    Path.init();
    Collision.init();
    UI.init();

    // Load any saved game data or preferences here
  }

  // Start the game
  function start() {
    if (isGameRunning) return;

    // Reset game state
    obstacles.forEach((obstacle) => obstacle.remove());
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    isOffPath = false;

    // Reset modules
    Player.resetPosition();
    Path.reset();
    UI.hideGameOver();

    isGameRunning = true;

    // Start game loop
    requestAnimationFrame(gameLoop);
  }

  // Game loop
  function gameLoop(timestamp) {
    if (!isGameRunning) return;

    // Check for collisions first
    const collisionResult = Collision.checkPathBounds();

    // Handle collision results
    if (collisionResult === true) {
      // True means boundary collision - game over
      gameOver();
      return;
    } else if (collisionResult === "slowdown") {
      // Player is off the path - apply slowdown
      isOffPath = true;
    } else {
      isOffPath = false;
    }

    // Update game elements with appropriate speed
    const effectiveSpeed = isOffPath ? gameSpeed * 0.5 : gameSpeed;
    Player.update(effectiveSpeed);
    Path.update(gameSpeed); // Path always moves at full speed

    // Update score
    score += 0.01 * (isOffPath ? gameSpeed * 0.3 : gameSpeed);
    UI.updateScore(score);

    // Increase game speed gradually as score increases
    if (Math.floor(score) % 10 === 0 && Math.floor(score) > 0) {
      gameSpeed = Math.min(gameSpeed + 0.001, 12); // Cap at maximum speed of 12
    }

    // Continue the game loop
    requestAnimationFrame(gameLoop);
  }

  // Game over
  function gameOver() {
    isGameRunning = false;
    UI.showGameOver(score);
  }

  // Public API
  return {
    init,
    start,
    gameOver,
  };
})();

// Initialize the game when the page loads
window.addEventListener("load", Game.init);
