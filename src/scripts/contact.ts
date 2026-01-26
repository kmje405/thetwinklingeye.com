interface ContactResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

interface ContactData {
  email: string;
  name: string;
  subject: string;
  message: string;
  hp?: string; // honeypot
  turnstileToken?: string | null;
}

export class ContactForm {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private nameInput: HTMLInputElement;
  private subjectInput: HTMLInputElement;
  private messageInput: HTMLTextAreaElement;
  private submitButton: HTMLButtonElement;
  private messageContainer: HTMLElement;
  private turnstileWidget: HTMLElement | null;

  constructor(formSelector: string) {
    const form = document.querySelector(formSelector) as HTMLFormElement;
    if (!form) {
      throw new Error(`Contact form not found: ${formSelector}`);
    }

    this.form = form;
    this.emailInput = form.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    this.nameInput = form.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    this.subjectInput = form.querySelector(
      'input[name="subject"]'
    ) as HTMLInputElement;
    this.messageInput = form.querySelector(
      'textarea[name="message"]'
    ) as HTMLTextAreaElement;
    this.submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    this.messageContainer = form.querySelector(".message") as HTMLElement;
    this.turnstileWidget = form.querySelector(".cf-turnstile") as HTMLElement;

    if (
      !this.emailInput ||
      !this.nameInput ||
      !this.subjectInput ||
      !this.messageInput ||
      !this.submitButton
    ) {
      throw new Error("Required form elements not found");
    }

    this.init();
  }

  private init(): void {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.emailInput.value.trim();
    const name = this.nameInput.value.trim();
    const subject = this.subjectInput.value.trim();
    const message = this.messageInput.value.trim();

    // Basic validation
    if (!email) {
      this.showMessage("Please enter your email address.", "error");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!name || name.length < 2) {
      this.showMessage("Please enter your name.", "error");
      return;
    }

    if (!subject || subject.length < 3) {
      this.showMessage("Please enter a subject.", "error");
      return;
    }

    if (!message || message.length < 10) {
      this.showMessage(
        "Please enter a message (at least 10 characters).",
        "error"
      );
      return;
    }

    if (name.length > 80) {
      this.showMessage("Name is too long (maximum 80 characters).", "error");
      return;
    }

    if (subject.length > 200) {
      this.showMessage(
        "Subject is too long (maximum 200 characters).",
        "error"
      );
      return;
    }

    if (message.length > 2000) {
      this.showMessage(
        "Message is too long (maximum 2000 characters).",
        "error"
      );
      return;
    }

    // Get Turnstile token
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
      const response = await this.submitContact({
        email,
        name,
        subject,
        message,
        turnstileToken,
      });

      if (response.ok) {
        this.showMessage(
          response.message ||
            "Thank you for your message! We'll get back to you soon.",
          "success"
        );
        this.form.reset();
        this.resetTurnstile();
      } else {
        this.handleError(response.error || "Submission failed");
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      this.showMessage("Network error. Please try again later.", "error");
    } finally {
      this.setLoading(false);
    }
  }

  private async submitContact(data: ContactData): Promise<ContactResponse> {
    const response = await fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  private handleError(error: string): void {
    let message = "Failed to send message. Please try again later.";

    switch (error) {
      case "invalid_email":
        message = "Please enter a valid email address.";
        break;
      case "name_required":
        message = "Please enter your name.";
        break;
      case "subject_required":
        message = "Please enter a subject.";
        break;
      case "message_too_short":
        message = "Please enter a longer message (at least 10 characters).";
        break;
      case "name_too_long":
        message = "Name is too long. Please use a shorter name.";
        break;
      case "subject_too_long":
        message = "Subject is too long. Please use a shorter subject.";
        break;
      case "message_too_long":
        message = "Message is too long. Please shorten your message.";
        break;
      case "rate_limited":
        message = "Too many submissions. Please try again later.";
        break;
      case "turnstile_failed":
        message = "Security verification failed. Please try again.";
        break;
    }

    this.showMessage(message, "error");
  }

  private showMessage(message: string, type: "success" | "error"): void {
    if (!this.messageContainer) return;

    this.messageContainer.textContent = message;
    this.messageContainer.className = `message ${type}`;
    this.messageContainer.style.display = "block";

    // Auto-hide success messages after 8 seconds
    if (type === "success") {
      setTimeout(() => {
        this.messageContainer.style.display = "none";
      }, 8000);
    }
  }

  private setLoading(loading: boolean): void {
    this.submitButton.disabled = loading;
    this.submitButton.textContent = loading ? "Sending..." : "Send Message";
    this.emailInput.disabled = loading;
    this.nameInput.disabled = loading;
    this.subjectInput.disabled = loading;
    this.messageInput.disabled = loading;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getTurnstileToken(): string | null {
    if (!this.turnstileWidget) return null;

    try {
      const turnstileResponse = (window as any).turnstile?.getResponse(
        this.turnstileWidget
      );
      return turnstileResponse || null;
    } catch (error) {
      console.error("Error getting Turnstile token:", error);
      return null;
    }
  }

  private resetTurnstile(): void {
    if (!this.turnstileWidget) return;

    try {
      if ((window as any).turnstile?.reset) {
        (window as any).turnstile.reset(this.turnstileWidget);
      }
    } catch (error) {
      console.error("Error resetting Turnstile widget:", error);
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    new ContactForm("#contact-form");
  } catch (error) {
    console.warn("Contact form not found or failed to initialize:", error);
  }
});
