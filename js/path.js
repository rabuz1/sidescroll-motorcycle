// Path module
const Path = (function () {
  // Path elements
  let dirtPathElement;
  let backgroundElement;

  // Path variables
  const pathInitialWidth = 200;
  const pathInitialY = 200; // Top position of the path
  let pathPosition = 0; // Track path position for scrolling effect

  // Initialize path
  function init() {
    dirtPathElement = document.getElementById("dirt-path");
    backgroundElement = document.getElementById("background");
  }

  // Reset path
  function reset() {
    pathPosition = 0;
    // Reset any path modifications here
  }

  // Update path position and appearance
  function update(gameSpeed) {
    pathPosition += gameSpeed;

    // Create a repeating pattern for the background
    const backgroundPattern = -pathPosition % 100;
    backgroundElement.style.backgroundPosition = `${backgroundPattern}px 0`;

    // Future enhancement: Add dynamic path width and height changes
  }

  // Get path position and dimensions
  function getRect() {
    return dirtPathElement.getBoundingClientRect();
  }

  // Public API
  return {
    init,
    update,
    reset,
    getRect,
  };
})();
