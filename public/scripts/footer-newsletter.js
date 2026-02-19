document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("footer-newsletter-form");
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const consentInput = form.querySelector('input[name="consent"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const messageDiv = form.querySelector(".message");

  if (!emailInput || !consentInput || !submitBtn || !messageDiv) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const consent = consentInput.checked;
    const honeypotInput = form.querySelector('input[name="hp"]');
    const honeypot = honeypotInput?.value;

    // Check honeypot
    if (honeypot) return;

    // Basic validation
    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!consent) {
      showMessage("Please agree to receive our newsletter.", "error");
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Subscribing...";

    try {
      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          consent: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("Successfully subscribed!", "success");
        form.reset();
      } else {
        showMessage(
          result.error || "Subscription failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      showMessage("Network error. Please try again later.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "SUBSCRIBE";
    }
  });

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";

    // Focus the message for screen readers
    messageDiv.setAttribute("tabindex", "-1");
    messageDiv.focus();

    if (type === "success") {
      setTimeout(() => {
        messageDiv.style.display = "none";
        messageDiv.removeAttribute("tabindex");
      }, 5000);
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
