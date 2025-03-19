// Input handling module
const InputHandler = (function () {
  // Key states
  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  // Handle key down events
  function handleKeyDown(e) {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
      e.preventDefault();
    }
  }

  // Handle key up events
  function handleKeyUp(e) {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
      e.preventDefault();
    }
  }

  // Initialize input handlers
  function init() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  // Public API
  return {
    init,
    keys,
  };
})();
