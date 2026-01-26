// Newsletter subscription functionality
class NewsletterSubscription {
  constructor(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) {
      throw new Error(`Newsletter form not found: ${formSelector}`);
    }

    this.form = form;
    this.emailInput = form.querySelector('input[type="email"]');
    this.nameInput = form.querySelector('input[name="name"]');
    this.consentInput = form.querySelector('input[name="consent"]');
    this.submitButton = form.querySelector('button[type="submit"]');
    this.messageContainer = form.querySelector(".message");
    this.turnstileWidget = form.querySelector(".cf-turnstile");

    if (!this.emailInput || !this.submitButton || !this.consentInput) {
      throw new Error(
        "Required form elements not found (email input, submit button, or consent checkbox)"
      );
    }

    this.init();
  }

  init() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const email = this.emailInput.value.trim();
    const name = this.nameInput?.value.trim() || "";
    const consent = this.consentInput.checked;

    // Basic validation
    if (!email) {
      this.showMessage("Please enter your email address.", "error");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!consent) {
      this.showMessage("Please agree to receive our newsletter.", "error");
      return;
    }

    // Get Turnstile token (only if widget is present)
    let turnstileToken = null;
    if (this.turnstileWidget) {
      turnstileToken = this.getTurnstileToken();
      if (!turnstileToken) {
        this.showMessage("Please complete the security verification.", "error");
        return;
      }
    }

    // Disable form during submission
    this.setLoading(true);

    try {
      const response = await this.subscribe({
        email,
        name,
        consent,
        turnstileToken,
      });

      if (response.ok) {
        this.showMessage(
          response.message || "Successfully subscribed!",
          "success"
        );
        this.form.reset();
        this.resetTurnstile();
      } else {
        this.handleError(response.error || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      this.showMessage("Network error. Please try again later.", "error");
    } finally {
      this.setLoading(false);
    }
  }

  async subscribe(data) {
    const response = await fetch("/.netlify/functions/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  handleError(error) {
    let message = "Subscription failed. Please try again later.";

    switch (error) {
      case "invalid_email":
        message = "Please enter a valid email address.";
        break;
      case "already_subscribed":
        message = "This email is already subscribed to our newsletter.";
        break;
      case "rate_limited":
        message = "Too many attempts. Please try again later.";
        break;
      case "name_too_long":
        message = "Name is too long. Please use a shorter name.";
        break;
    }

    this.showMessage(message, "error");
  }

  showMessage(message, type) {
    if (!this.messageContainer) return;

    this.messageContainer.textContent = message;
    this.messageContainer.className = `message ${type}`;
    this.messageContainer.style.display = "block";

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        this.messageContainer.style.display = "none";
      }, 5000);
    }
  }

  setLoading(loading) {
    this.submitButton.disabled = loading;
    this.submitButton.textContent = loading ? "Subscribing..." : "Subscribe";
    this.emailInput.disabled = loading;
    this.consentInput.disabled = loading;
    if (this.nameInput) {
      this.nameInput.disabled = loading;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getTurnstileToken() {
    if (!this.turnstileWidget) return null;

    // Get the Turnstile response token from the widget
    try {
      const turnstileResponse = window.turnstile?.getResponse(
        this.turnstileWidget
      );
      return turnstileResponse || null;
    } catch (error) {
      console.error("Error getting Turnstile token:", error);
      return null;
    }
  }

  resetTurnstile() {
    if (!this.turnstileWidget) return;

    // Reset the Turnstile widget
    try {
      if (window.turnstile?.reset) {
        window.turnstile.reset(this.turnstileWidget);
      }
    } catch (error) {
      console.error("Error resetting Turnstile widget:", error);
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    new NewsletterSubscription("#newsletter-form");
  } catch (error) {
    console.warn("Newsletter form not found or failed to initialize:", error);
  }
});
