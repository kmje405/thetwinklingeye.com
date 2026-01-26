// Content loader script - handles page loading states
function initContentLoader() {
  function addContentLoadedClass() {
    document.body.classList.add("content-loaded");
  }

  // Add content-loaded class when page is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addContentLoadedClass);
  } else {
    // DOM is already loaded
    addContentLoadedClass();
  }
}

// Auto-initialize when script loads
initContentLoader();
