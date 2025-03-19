// Path module
const Path = (function () {
  // Path elements
  let dirtPathElement;
  let backgroundElement;
  let pathSegments = [];
  const gameAreaWidth = 800;

  // Path variables
  const pathInitialHeight = 120; // Initial path height
  const pathInitialY = 240; // Initial vertical position (centered)
  let pathPosition = 0; // Track path position for scrolling effect

  // Path variation variables
  let currentPathY = pathInitialY;
  let currentPathHeight = pathInitialHeight;
  let targetPathY = pathInitialY;
  let targetPathHeight = pathInitialHeight;
  let nextChangePoint = 500; // Game units until next path change

  // Path change parameters
  const minPathHeight = 80;
  const maxPathHeight = 160;
  const minPathY = 150;
  const maxPathY = 350;
  const pathChangeRate = 0.05; // How quickly the path changes (lower = smoother)

  // Path segment management
  const segmentWidth = 30; // Width of each path segment (smaller = smoother)
  let lastSegmentY = pathInitialY;
  let lastSegmentHeight = pathInitialHeight;

  // Initialize path
  function init() {
    dirtPathElement = document.getElementById("dirt-path");
    backgroundElement = document.getElementById("background");

    // Hide the original dirt path element since we'll use segments
    dirtPathElement.style.display = "none";

    // Clear any existing segments
    clearPathSegments();

    // Create initial path segments
    createInitialPathSegments();
  }

  // Clear all path segments
  function clearPathSegments() {
    // Remove all existing path segments
    pathSegments.forEach((segment) => {
      if (segment.element && segment.element.parentNode) {
        segment.element.parentNode.removeChild(segment.element);
      }
    });
    pathSegments = [];
  }

  // Create initial path segments
  function createInitialPathSegments() {
    const gameArea = document.querySelector(".game-area");

    // Create enough segments to fill the screen plus some buffer
    const numSegments = Math.ceil(gameAreaWidth / segmentWidth) + 5;

    for (let i = 0; i < numSegments; i++) {
      const segment = document.createElement("div");
      segment.className = "path-segment";
      segment.style.left = i * segmentWidth + "px";
      segment.style.top = currentPathY + "px";
      segment.style.height = currentPathHeight + "px";
      segment.style.width = segmentWidth + "px";

      gameArea.appendChild(segment);

      pathSegments.push({
        element: segment,
        x: i * segmentWidth,
        y: currentPathY,
        height: currentPathHeight,
      });
    }

    lastSegmentY = currentPathY;
    lastSegmentHeight = currentPathHeight;
  }

  // Reset path
  function reset() {
    pathPosition = 0;
    currentPathY = pathInitialY;
    currentPathHeight = pathInitialHeight;
    targetPathY = pathInitialY;
    targetPathHeight = pathInitialHeight;
    nextChangePoint = 500;
    lastSegmentY = pathInitialY;
    lastSegmentHeight = pathInitialHeight;

    // Reset path appearance
    clearPathSegments();
    createInitialPathSegments();
  }

  // Generate new path targets
  function generateNewPathTargets() {
    // Generate new target height
    targetPathHeight = Math.floor(
      Math.random() * (maxPathHeight - minPathHeight) + minPathHeight
    );

    // Generate new target Y position, but ensure it stays within screen bounds
    const maxPossibleY = maxPathY - (targetPathHeight - pathInitialHeight);
    targetPathY = Math.floor(
      Math.random() * (maxPossibleY - minPathY) + minPathY
    );

    // Set next change point
    nextChangePoint = pathPosition + Math.random() * 800 + 400;
  }

  // Add a new path segment
  function addNewPathSegment() {
    // Calculate the Y position for the new segment
    // This creates a gradual transition from the last segment to the target
    const yDiff = targetPathY - lastSegmentY;
    const heightDiff = targetPathHeight - lastSegmentHeight;

    // Determine how much to change per segment (creates diagonal effect)
    const yStep = yDiff * pathChangeRate;
    const heightStep = heightDiff * pathChangeRate;

    // Calculate new segment position
    const newY = lastSegmentY + yStep;
    const newHeight = lastSegmentHeight + heightStep;

    // Create new segment
    const gameArea = document.querySelector(".game-area");
    const segment = document.createElement("div");
    segment.className = "path-segment";

    // Position at the right edge of the screen
    segment.style.left = gameAreaWidth + "px";
    segment.style.top = newY + "px";
    segment.style.height = newHeight + "px";
    segment.style.width = segmentWidth + "px";

    gameArea.appendChild(segment);

    // Add to our segments array
    pathSegments.push({
      element: segment,
      x: gameAreaWidth,
      y: newY,
      height: newHeight,
    });

    // Update last segment values
    lastSegmentY = newY;
    lastSegmentHeight = newHeight;
  }

  // Update path position and appearance
  function update(gameSpeed) {
    pathPosition += gameSpeed;

    // Create a repeating pattern for the background
    const backgroundPattern = -pathPosition % 100;
    backgroundElement.style.backgroundPosition = `${backgroundPattern}px 0`;

    // Check if it's time to change the path
    if (pathPosition >= nextChangePoint) {
      generateNewPathTargets();
    }

    // Move all segments to the left
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      segment.x -= gameSpeed;
      segment.element.style.left = segment.x + "px";

      // Remove segments that have moved off-screen
      if (segment.x < -segmentWidth) {
        if (segment.element && segment.element.parentNode) {
          segment.element.parentNode.removeChild(segment.element);
        }
        pathSegments.splice(i, 1);
        i--;
      }
    }

    // Add new segments as needed
    if (pathSegments.length > 0) {
      const rightmostSegment = pathSegments[pathSegments.length - 1];
      if (rightmostSegment.x < gameAreaWidth) {
        addNewPathSegment();
      }
    } else {
      // If we somehow lost all segments, recreate them
      createInitialPathSegments();
    }
  }

  // Get path position and dimensions for collision detection
  function getRect() {
    // Find the segment that contains the player (around x=100)
    const playerX = 100;
    let relevantSegment = null;

    for (const segment of pathSegments) {
      if (segment.x <= playerX && segment.x + segmentWidth > playerX) {
        relevantSegment = segment;
        break;
      }
    }

    // If no segment found, use default values
    if (!relevantSegment) {
      return {
        top: currentPathY,
        bottom: currentPathY + currentPathHeight,
        left: 0,
        right: gameAreaWidth,
      };
    }

    // Return the bounds of the relevant segment
    // These coordinates are already relative to the game area
    return {
      top: relevantSegment.y,
      bottom: relevantSegment.y + relevantSegment.height,
      left: relevantSegment.x,
      right: relevantSegment.x + segmentWidth,
    };
  }

  // Public API
  return {
    init,
    update,
    reset,
    getRect,
  };
})();
