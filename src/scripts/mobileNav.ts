// Mobile navigation toggle functionality
export function initMobileNav() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

  if (hamburgerBtn && mobileNavOverlay) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = mobileNavOverlay.classList.contains("open");

      if (isOpen) {
        mobileNavOverlay.classList.remove("open");
        hamburgerBtn.classList.remove("open");
      } else {
        mobileNavOverlay.classList.add("open");
        hamburgerBtn.classList.add("open");
      }
    });

    // Close menu when clicking on a link
    const navLinks = mobileNavOverlay.querySelectorAll(".mobile-nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavOverlay.classList.remove("open");
        hamburgerBtn.classList.remove("open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const target = e.target as Node;
      if (
        !hamburgerBtn.contains(target) &&
        !mobileNavOverlay.contains(target)
      ) {
        mobileNavOverlay.classList.remove("open");
        hamburgerBtn.classList.remove("open");
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initMobileNav);
