// Player module
const Player = (function () {
  // Player element
  let playerElement;

  // Player movement variables
  let playerY = 290; // Initial vertical position
  let playerX = 100; // Initial horizontal position
  let playerSpeedY = 0;
  let playerSpeedX = 0;
  const playerAcceleration = 0.5;
  const playerDeceleration = 0.2;
  const playerMaxSpeed = 8;

  // Initialize player
  function init() {
    playerElement = document.getElementById("player");
    resetPosition();
  }

  // Reset player position
  function resetPosition() {
    playerY = 290;
    playerX = 100;
    playerSpeedY = 0;
    playerSpeedX = 0;
    updateVisualPosition();
  }

  // Update player position based on input
  function update(gameSpeed) {
    // Determine if we're using reduced speed (when off path)
    const isSlowedDown = gameSpeed < 5;
    const accelerationMultiplier = isSlowedDown ? 0.5 : 1;

    // Vertical movement
    if (InputHandler.keys.ArrowUp) {
      playerSpeedY = Math.max(
        playerSpeedY - playerAcceleration * accelerationMultiplier,
        -playerMaxSpeed * accelerationMultiplier
      );
    } else if (InputHandler.keys.ArrowDown) {
      playerSpeedY = Math.min(
        playerSpeedY + playerAcceleration * accelerationMultiplier,
        playerMaxSpeed * accelerationMultiplier
      );
    } else {
      // Decelerate when no keys are pressed
      if (playerSpeedY > 0) {
        playerSpeedY = Math.max(0, playerSpeedY - playerDeceleration);
      } else if (playerSpeedY < 0) {
        playerSpeedY = Math.min(0, playerSpeedY + playerDeceleration);
      }
    }

    // Horizontal movement
    if (InputHandler.keys.ArrowRight) {
      playerSpeedX = Math.min(
        playerSpeedX + playerAcceleration * accelerationMultiplier,
        playerMaxSpeed * accelerationMultiplier
      );
    } else if (InputHandler.keys.ArrowLeft) {
      playerSpeedX = Math.max(
        playerSpeedX - playerAcceleration * accelerationMultiplier,
        -playerMaxSpeed * accelerationMultiplier
      );
    } else {
      // Decelerate when no keys are pressed
      if (playerSpeedX > 0) {
        playerSpeedX = Math.max(0, playerSpeedX - playerDeceleration);
      } else if (playerSpeedX < 0) {
        playerSpeedX = Math.min(0, playerSpeedX + playerDeceleration);
      }
    }

    // Apply constant leftward drift if not accelerating enough
    if (playerSpeedX < gameSpeed) {
      playerX -= (gameSpeed - playerSpeedX) * 0.5;
    } else {
      playerX += playerSpeedX - gameSpeed;
    }

    // Update vertical position
    playerY += playerSpeedY;

    // Apply position updates
    updateVisualPosition();
  }

  // Update the visual position of the player
  function updateVisualPosition() {
    playerElement.style.top = playerY + "px";
    playerElement.style.left = playerX + "px";
  }

  // Get player position and dimensions
  function getRect() {
    return playerElement.getBoundingClientRect();
  }

  // Public API
  return {
    init,
    update,
    resetPosition,
    getRect,
  };
})();
