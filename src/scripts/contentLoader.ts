// Content loader script - handles page loading states
export function initContentLoader(): void {
  function addContentLoadedClass(): void {
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
