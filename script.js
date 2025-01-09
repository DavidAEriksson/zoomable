const zoomableElement = document.getElementById("zoomable");

let isPinching = false; // To track pinch gestures
let initialDistance = 0; // Initial distance between two touch points
let scale = 1; // Current zoom scale
let offsetX = 0; // Translation X offset
let offsetY = 0; // Translation Y offset
let lastPinchCenter = { x: 0, y: 0 }; // Last pinch center

// Calculate distance between two touch points
function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate the center point of two touch points
function getCenter(touches) {
  const [touch1, touch2] = touches;
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

// Handle touchstart
zoomableElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // Pinch start
    isPinching = true;
    initialDistance = getDistance(e.touches);
    lastPinchCenter = getCenter(e.touches);
  }
});

// Handle touchmove
zoomableElement.addEventListener("touchmove", (e) => {
  if (isPinching && e.touches.length === 2) {
    const newDistance = getDistance(e.touches);
    const newCenter = getCenter(e.touches);

    // Calculate zoom factor
    const zoomFactor = newDistance / initialDistance;
    const newScale = Math.min(Math.max(1, scale * zoomFactor), 5); // Clamp scale between 1x and 5x

    // Calculate translation to keep the pinch center under the fingers
    const deltaX = (newCenter.x - lastPinchCenter.x) / scale;
    const deltaY = (newCenter.y - lastPinchCenter.y) / scale;

    offsetX += deltaX;
    offsetY += deltaY;

    // Update transform
    zoomableElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${newScale})`;

    // Save state
    initialDistance = newDistance;
    lastPinchCenter = newCenter;
    scale = newScale;

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
