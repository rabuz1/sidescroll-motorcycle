// Player module
const Player = (function () {
  // Player element
  let playerElement;

  // Player position constants (single source of truth)
  const INITIAL_PLAYER_X = 100;
  const INITIAL_PLAYER_Y = 240;

  // Player movement variables
  let playerY = INITIAL_PLAYER_Y; // Use the constant
  let playerX = INITIAL_PLAYER_X; // Use the constant
  let playerSpeedY = 0;
  let playerSpeedX = 0;
  const playerAcceleration = 1.0;
  const playerDeceleration = 0.4;
  const playerMaxSpeed = 16;

  // Initialize player
  function init() {
    playerElement = document.getElementById("player");
    resetPosition();

    // Set initial CSS position to match JavaScript position
    document.documentElement.style.setProperty(
      "--player-initial-x",
      INITIAL_PLAYER_X + "px"
    );
    document.documentElement.style.setProperty(
      "--player-initial-y",
      INITIAL_PLAYER_Y + "px"
    );
  }

  // Reset player position
  function resetPosition() {
    playerY = INITIAL_PLAYER_Y;
    playerX = INITIAL_PLAYER_X;
    playerSpeedY = 0;
    playerSpeedX = 0;
    updateVisualPosition();
  }

  // Update player position based on input
  function update(gameSpeed) {
    // Determine if we're using reduced speed (when off path)
    const isSlowedDown = gameSpeed < 10;

    // Adjust acceleration and max speed based on path status
    const accelerationMultiplier = isSlowedDown ? 0.3 : 1.0;
    const maxSpeedMultiplier = isSlowedDown ? 0.2 : 1.0;
    const effectiveMaxSpeed = playerMaxSpeed * maxSpeedMultiplier;

    // Vertical movement
    if (InputHandler.keys.ArrowUp) {
      playerSpeedY = Math.max(
        playerSpeedY - playerAcceleration * accelerationMultiplier,
        -effectiveMaxSpeed
      );
    } else if (InputHandler.keys.ArrowDown) {
      playerSpeedY = Math.min(
        playerSpeedY + playerAcceleration * accelerationMultiplier,
        effectiveMaxSpeed
      );
    } else {
      // Decelerate when no keys are pressed - use a fixed deceleration rate
      // that's stronger when off-path
      const currentDeceleration = isSlowedDown
        ? playerDeceleration * 2
        : playerDeceleration;

      if (playerSpeedY > 0) {
        playerSpeedY = Math.max(0, playerSpeedY - currentDeceleration);
      } else if (playerSpeedY < 0) {
        playerSpeedY = Math.min(0, playerSpeedY + currentDeceleration);
      }
    }

    // Horizontal movement
    if (InputHandler.keys.ArrowRight) {
      playerSpeedX = Math.min(
        playerSpeedX + playerAcceleration * accelerationMultiplier,
        effectiveMaxSpeed
      );
    } else if (InputHandler.keys.ArrowLeft) {
      playerSpeedX = Math.max(
        playerSpeedX - playerAcceleration * accelerationMultiplier,
        -effectiveMaxSpeed
      );
    } else {
      // Decelerate when no keys are pressed - use a fixed deceleration rate
      // that's stronger when off-path
      const currentDeceleration = isSlowedDown
        ? playerDeceleration * 2
        : playerDeceleration;

      if (playerSpeedX > 0) {
        playerSpeedX = Math.max(0, playerSpeedX - currentDeceleration);
      } else if (playerSpeedX < 0) {
        playerSpeedX = Math.min(0, playerSpeedX + currentDeceleration);
      }
    }

    // Apply constant leftward drift if not accelerating enough
    if (playerSpeedX < gameSpeed) {
      // Much stronger drift when off path
      const driftMultiplier = isSlowedDown ? 3.0 : 0.5;
      playerX -= (gameSpeed - playerSpeedX) * driftMultiplier;
    } else {
      // Reduced forward movement when off path
      const forwardMultiplier = isSlowedDown ? 0.4 : 1.0;
      playerX += (playerSpeedX - gameSpeed) * forwardMultiplier;
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
