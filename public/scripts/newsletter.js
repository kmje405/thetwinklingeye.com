document.addEventListener("DOMContentLoaded", function () {
  console.log("Newsletter script loaded");

  const form = document.getElementById("newsletter-form");
  if (!form) {
    console.log("Newsletter form not found");
    return;
  }

  console.log("Newsletter form found, adding event listener");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Form submission intercepted");

    const submitBtn = form.querySelector(".subscribe-btn");
    const messageDiv = form.querySelector(".message");
    const originalText = submitBtn?.textContent || "Subscribe";

    if (!submitBtn || !messageDiv) return;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Subscribing...";

      // Hide any existing messages
      messageDiv.style.display = "none";
      messageDiv.className = "message";

      // Check consent
      const consentCheckbox = form.querySelector("#consent");
      if (!consentCheckbox || !consentCheckbox.checked) {
        throw new Error("Please consent to receiving newsletters");
      }

      // Prepare form data
      const formData = new FormData(form);
      const data = {
        email: formData.get("email"),
        name: formData.get("name"),
        hp: formData.get("hp") || "",
      };

      console.log("Sending data:", data);

      // Submit to Netlify function
      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        messageDiv.textContent =
          "✅ " + (result.message || "Successfully subscribed to newsletter!");
        messageDiv.className = "message success";
        form.reset();
      } else {
        throw new Error(result.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again later.";
      messageDiv.textContent = "❌ " + errorMessage;
      messageDiv.className = "message error";
    } finally {
      messageDiv.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
