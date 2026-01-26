// Contact form functionality - character counter and form reset
function initContactForm() {
  document.addEventListener("DOMContentLoaded", () => {
    const messageTextarea = document.getElementById("message");
    const charCount = document.getElementById("char-count");
    const form = document.querySelector(".contact-form");

    // Character counter functionality
    if (messageTextarea && charCount) {
      const updateCount = () => {
        const count = messageTextarea.value.length;
        charCount.textContent = count.toString();

        // Change color when approaching limit
        if (count > 1800) {
          charCount.style.color = "#f44336";
        } else if (count > 1500) {
          charCount.style.color = "#ff9800";
        } else {
          charCount.style.color = "rgba(255, 255, 255, 0.7)";
        }
      };

      messageTextarea.addEventListener("input", updateCount);
      updateCount(); // Initial count
    }

    // Reset form when returning from Formspree
    // Check if URL contains success parameter or if we're returning from submission
    const urlParams = new URLSearchParams(window.location.search);
    const isReturningFromFormspree =
      urlParams.has("success") ||
      document.referrer.includes("formspree.io") ||
      sessionStorage.getItem("formSubmitted") === "true";

    if (isReturningFromFormspree && form) {
      // Reset the form
      form.reset();

      // Reset character counter
      if (charCount) {
        charCount.textContent = "0";
        charCount.style.color = "rgba(255, 255, 255, 0.7)";
      }

      // Clear the session storage flag
      sessionStorage.removeItem("formSubmitted");

      // Show success message
      showSuccessMessage();

      // Clean up URL if it has success parameter
      if (urlParams.has("success")) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Set flag when form is submitted
    if (form) {
      form.addEventListener("submit", () => {
        sessionStorage.setItem("formSubmitted", "true");
      });
    }

    function showSuccessMessage() {
      // Create and show success message
      const successDiv = document.createElement("div");
      successDiv.className = "success-message";
      successDiv.innerHTML = `
        <p>✅ Thank you! Your message has been sent successfully. We'll get back to you soon!</p>
      `;

      // Insert after the form
      if (form && form.parentNode) {
        form.parentNode.insertBefore(successDiv, form.nextSibling);

        // Remove message after 5 seconds
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
          }
        }, 5000);
      }
    }
  });
}

// Auto-initialize when script loads
initContactForm();
