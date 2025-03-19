// Collision detection module
const Collision = (function () {
  // Game area element
  let gameAreaElement;

  // Initialize collision detection
  function init() {
    gameAreaElement = document.querySelector(".game-area");
  }

  // Check if player is within the dirt path bounds
  function checkPathBounds() {
    const pathRect = Path.getRect();
    const playerRect = Player.getRect();
    const gameAreaRect = gameAreaElement.getBoundingClientRect();

    // Check if player is outside the game area boundaries (top/bottom/left/right)
    if (
      playerRect.top < gameAreaRect.top ||
      playerRect.bottom > gameAreaRect.bottom ||
      playerRect.left < gameAreaRect.left ||
      playerRect.right > gameAreaRect.right
    ) {
      return true; // Collision detected - game over
    }

    // Check if player is outside the dirt path (but still in game area)
    if (playerRect.bottom < pathRect.top || playerRect.top > pathRect.bottom) {
      // Player is off the path - return a special value to indicate slowdown
      return "slowdown";
    }

    return false; // No collision
  }

  // Public API
  return {
    init,
    checkPathBounds,
  };
})();
