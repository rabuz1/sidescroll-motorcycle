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

    // Get game area position for coordinate system conversion
    const gameAreaRect = gameAreaElement.getBoundingClientRect();

    // Convert player coordinates to be relative to the game area
    // This fixes issues with browser window size affecting detection
    const relativePlayerTop = playerRect.top - gameAreaRect.top;
    const relativePlayerBottom = playerRect.bottom - gameAreaRect.top;
    const relativePlayerLeft = playerRect.left - gameAreaRect.left;
    const relativePlayerRight = playerRect.right - gameAreaRect.left;

    // Check if player is outside the game area boundaries
    if (
      relativePlayerTop < 0 ||
      relativePlayerBottom > gameAreaRect.height ||
      relativePlayerLeft < 0 ||
      relativePlayerRight > gameAreaRect.width
    ) {
      return true; // Collision detected - game over
    }

    // Calculate the center point of the player (relative to game area)
    const playerCenterY = (relativePlayerTop + relativePlayerBottom) / 2;

    // Debug - log positions to console (but less frequently to avoid spam)
    if (Math.random() < 0.01) {
      console.log(
        `Player center: ${playerCenterY}, Path top: ${pathRect.top}, Path bottom: ${pathRect.bottom}`
      );
    }

    // Check if player's center is within the path bounds
    // Add a small buffer (5px) to make detection more forgiving
    if (
      playerCenterY >= pathRect.top - 5 &&
      playerCenterY <= pathRect.bottom + 5
    ) {
      return false; // Player is on the path - normal physics
    } else {
      // Player is off the path - return a special value to indicate slowdown
      return "slowdown";
    }
  }

  // Public API
  return {
    init,
    checkPathBounds,
  };
})();
