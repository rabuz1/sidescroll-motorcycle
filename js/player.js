// Player module
const Player = (function () {
  // Player element
  let playerElement;

  // Player movement variables
  let playerY = 290; // Initial vertical position
  let playerX = 100; // Initial horizontal position
  let playerSpeedY = 0;
  let playerSpeedX = 0;
  const playerAcceleration = 1.0;
  const playerDeceleration = 0.4;
  const playerMaxSpeed = 16;

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
    const isSlowedDown = gameSpeed < 10;
    const accelerationMultiplier = isSlowedDown ? 0.5 : 1;
    const decelerationMultiplier = isSlowedDown ? 4.0 : 1.0; // Increased from 2.0 to 4.0 for more dramatic effect

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
        playerSpeedY = Math.max(
          0,
          playerSpeedY - playerDeceleration * decelerationMultiplier
        );
      } else if (playerSpeedY < 0) {
        playerSpeedY = Math.min(
          0,
          playerSpeedY + playerDeceleration * decelerationMultiplier
        );
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
        playerSpeedX = Math.max(
          0,
          playerSpeedX - playerDeceleration * decelerationMultiplier
        );
      } else if (playerSpeedX < 0) {
        playerSpeedX = Math.min(
          0,
          playerSpeedX + playerDeceleration * decelerationMultiplier
        );
      }
    }

    // Apply constant leftward drift if not accelerating enough
    if (playerSpeedX < gameSpeed) {
      // Increase the drift multiplier when off path
      const driftMultiplier = isSlowedDown ? 2.0 : 0.5; // Increased from 1.0 to 2.0 for more dramatic effect
      playerX -= (gameSpeed - playerSpeedX) * driftMultiplier;
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
