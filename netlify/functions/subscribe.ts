/**
 * MailerLite "new" API base:
 *   https://connect.mailerlite.com/api/subscribers
 *
 * Env vars required:
 *   MAILERLITE_API_TOKEN
 *
 * Optional:
 *   MAILERLITE_GROUP_ID        (if you want to assign a group)
 *   RATE_LIMIT_MAX             (default 5)
 *   RATE_LIMIT_WINDOW_SECONDS  (default 600 = 10 minutes)
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic in-memory rate limiting (good enough for low volume; not perfect in serverless)
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

interface SubscribePayload {
  email: string;
  name?: string;
  hp?: string; // honeypot
  turnstileToken?: string; // Cloudflare Turnstile token
}

interface MailerLiteSubscriber {
  email: string;
  fields?: {
    name?: string;
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
  // Netlify commonly provides client IP in x-nf-client-connection-ip
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
  // Use dummy secret key for development/testing
  const isDevelopment = process.env.NODE_ENV !== "production";
  const secretKey = isDevelopment
    ? "1x0000000000000000000000000000000AA" // Always passes validation
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
          remoteip: ip,
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
    console.log("Turnstile verification result:", result);

    if (!result.success) {
      console.error("Turnstile verification failed:", result["error-codes"]);
    }

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

    // Parse body (supports JSON)
    let payload: SubscribePayload;
    try {
      payload = event.body ? JSON.parse(event.body) : {};
    } catch {
      return json(400, { ok: false, error: "invalid_json" });
    }

    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const name = String(payload.name || "").trim();
    const hp = String(payload.hp || "").trim(); // honeypot
    const turnstileToken = String(payload.turnstileToken || "").trim();

    // Honeypot: if filled, pretend success (don't teach bots)
    if (hp) {
      return json(200, { ok: true, message: "Successfully subscribed!" });
    }

    // Get client IP (used for both Turnstile and rate limiting)
    const ip = getClientIp(event);

    // Verify Turnstile token (only if secret key is configured)
    const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        return json(400, { ok: false, error: "turnstile_missing" });
      }

      const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
      if (!turnstileValid) {
        return json(400, { ok: false, error: "turnstile_failed" });
      }
    } else {
      console.warn(
        "TURNSTILE_SECRET_KEY not configured - skipping Turnstile verification"
      );
    }

    // Validate
    if (!email || !EMAIL_RE.test(email)) {
      return json(400, { ok: false, error: "invalid_email" });
    }
    if (name.length > 80) {
      return json(400, { ok: false, error: "name_too_long" });
    }

    // Basic rate limit (by IP)
    const max = Number(process.env.RATE_LIMIT_MAX || 5);
    const windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 600);

    const rl = rateLimitCheck(`ip:${ip}`, max, windowSeconds);
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
    };

    // Add name if provided
    if (name) {
      subscriberData.fields = { name };
    }

    // Add to group if specified
    const groupId = process.env.MAILERLITE_GROUP_ID;
    if (groupId) {
      // Convert to number as MailerLite API expects numeric group IDs
      const numericGroupId = parseInt(groupId, 10);
      if (!isNaN(numericGroupId)) {
        subscriberData.groups = [numericGroupId];
      }
    }

    // Make request to MailerLite API
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

      // Handle specific MailerLite errors
      if (response.status === 422 && responseData.errors?.email) {
        const emailError = responseData.errors.email[0];
        if (emailError && emailError.includes("already exists")) {
          return json(409, {
            ok: false,
            error: "already_subscribed",
            message: "This email is already subscribed to our newsletter",
          });
        }
      }

      return json(response.status >= 500 ? 500 : 400, {
        ok: false,
        error: "subscription_failed",
        message: "Failed to subscribe. Please try again later.",
      });
    }

    // Success response
    return json(200, {
      ok: true,
      message: "Successfully subscribed to newsletter!",
      subscriber: {
        id: responseData.data.id,
        email: responseData.data.email,
        status: responseData.data.status,
      },
    });
  } catch (error) {
    console.error("Function error:", error);

    return json(500, {
      ok: false,
      error: "internal_error",
      message: "Internal server error. Please try again later.",
    });
  }
};
