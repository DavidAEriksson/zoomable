const zoomableElement = document.getElementById("zoomable");
let isPinching = false; // To track pinch gestures
let initialDistance = 0; // Initial distance between two touch points
let scale = 1; // Current scale of the zoomable element

// Calculate distance between two touch points
function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Handle touchstart
zoomableElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // Pinch start
    isPinching = true;
    initialDistance = getDistance(e.touches);
    e.preventDefault(); // Prevent scrolling during pinch start
  }
});

// Handle touchmove
zoomableElement.addEventListener("touchmove", (e) => {
  if (isPinching && e.touches.length === 2) {
    // Pinching
    const newDistance = getDistance(e.touches);
    const zoomFactor = newDistance / initialDistance;
    scale = Math.min(Math.max(1, scale * zoomFactor), 5); // Clamp scale between 1x and 5x
    zoomableElement.style.transform = `scale(${scale})`;
    initialDistance = newDistance; // Update for smooth zooming
    e.preventDefault(); // Prevent scrolling during pinch
  }
});

// Handle touchend
zoomableElement.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    // End pinch
    isPinching = false;
  }
});
