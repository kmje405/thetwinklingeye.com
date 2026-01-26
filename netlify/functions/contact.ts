/**
 * Contact form submission handler with MailerLite integration
 * Uses specific group ID: 177608043361470366
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic in-memory rate limiting
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

interface ContactPayload {
  email: string;
  name: string;
  subject: string;
  message: string;
  hp?: string; // honeypot
  turnstileToken?: string;
}

interface MailerLiteSubscriber {
  email: string;
  fields?: {
    name?: string;
    subject?: string;
    message?: string;
  };
  groups?: number[];
}

interface MailerLiteResponse {
  data: {
    id: string;
    email: string;
    status: string;
  };
  errors?: {
    email?: string[];
  };
}

function getClientIp(event: HandlerEvent): string {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    (event.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown"
  );
}

function rateLimitCheck(
  key: string,
  max: number,
  windowSeconds: number
): { ok: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1000)
    );
    return { ok: false, retryAfterSeconds };
  }

  entry.count += 1;
  rateBuckets.set(key, entry);
  return { ok: true };
}

async function verifyTurnstileToken(
  token: string,
  ip: string
): Promise<boolean> {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const secretKey = isDevelopment
    ? "1x0000000000000000000000000000000AA"
    : process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Turnstile API error:",
        response.status,
        response.statusText
      );
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

function json(
  statusCode: number,
  body: any,
  extraHeaders: Record<string, string> = {}
) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return json(200, {});
    }

    if (event.httpMethod !== "POST") {
      return json(
        405,
        { ok: false, error: "method_not_allowed" },
        { allow: "POST" }
      );
    }

    const token = process.env.MAILERLITE_API_TOKEN;
    if (!token) {
      console.error("MAILERLITE_API_TOKEN not configured");
      return json(500, { ok: false, error: "server_misconfigured" });
    }

    // Parse body
    let payload: ContactPayload;
    try {
      payload = event.body ? JSON.parse(event.body) : {};
    } catch {
      return json(400, { ok: false, error: "invalid_json" });
    }

    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const name = String(payload.name || "").trim();
    const subject = String(payload.subject || "").trim();
    const message = String(payload.message || "").trim();
    const hp = String(payload.hp || "").trim();
    const turnstileToken = String(payload.turnstileToken || "").trim();

    // Honeypot check
    if (hp) {
      return json(200, { ok: true, message: "Message sent successfully!" });
    }

    // Get client IP
    const ip = getClientIp(event);

    // Verify Turnstile token
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        return json(400, { ok: false, error: "turnstile_missing" });
      }

      const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
      if (!turnstileValid) {
        return json(400, { ok: false, error: "turnstile_failed" });
      }
    }

    // Validate required fields
    if (!email || !EMAIL_RE.test(email)) {
      return json(400, { ok: false, error: "invalid_email" });
    }
    if (!name || name.length < 2) {
      return json(400, { ok: false, error: "name_required" });
    }
    if (!subject || subject.length < 3) {
      return json(400, { ok: false, error: "subject_required" });
    }
    if (!message || message.length < 10) {
      return json(400, { ok: false, error: "message_too_short" });
    }
    if (name.length > 80) {
      return json(400, { ok: false, error: "name_too_long" });
    }
    if (subject.length > 200) {
      return json(400, { ok: false, error: "subject_too_long" });
    }
    if (message.length > 2000) {
      return json(400, { ok: false, error: "message_too_long" });
    }

    // Rate limiting
    const max = Number(process.env.RATE_LIMIT_MAX || 3); // Stricter for contact form
    const windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 600);

    const rl = rateLimitCheck(`contact:${ip}`, max, windowSeconds);
    if (!rl.ok) {
      return json(
        429,
        { ok: false, error: "rate_limited" },
        { "retry-after": String(rl.retryAfterSeconds) }
      );
    }

    // Prepare subscriber data for MailerLite
    const subscriberData: MailerLiteSubscriber = {
      email,
      fields: {
        name,
        subject,
        message,
      },
      // Temporarily removing group assignment to test if contact form works
      // groups: [177608043361470366], // Your specific contact form group ID
    };

    // Submit to MailerLite
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(subscriberData),
      }
    );

    const responseData: MailerLiteResponse = await response.json();

    if (!response.ok) {
      console.error("MailerLite API error:", {
        status: response.status,
        data: responseData,
      });

      // Handle specific errors
      if (response.status === 422 && responseData.errors?.email) {
        const emailError = responseData.errors.email[0];
        if (emailError && emailError.includes("already exists")) {
          // For contact forms, we still want to "succeed" even if email exists
          // The message will be stored in their custom fields
          return json(200, {
            ok: true,
            message: "Thank you for your message! We'll get back to you soon.",
          });
        }
      }

      return json(response.status >= 500 ? 500 : 400, {
        ok: false,
        error: "submission_failed",
        message: "Failed to send message. Please try again later.",
      });
    }

    // Success
    return json(200, {
      ok: true,
      message: "Thank you for your message! We'll get back to you soon.",
      contact: {
        id: responseData.data.id,
        email: responseData.data.email,
        status: responseData.data.status,
      },
    });
  } catch (error) {
    console.error("Contact function error:", error);

    return json(500, {
      ok: false,
      error: "internal_error",
      message: "Internal server error. Please try again later.",
    });
  }
};
