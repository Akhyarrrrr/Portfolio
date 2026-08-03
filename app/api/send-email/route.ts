// Resend's REST API over plain fetch — no SDK. It is one POST to one
// endpoint, so a dependency would buy nothing a dozen lines don't already do,
// and it lets this route own its own error surface.
// ponytail: swap to the `resend` package only if we start needing batching,
// attachments, audiences, or React email templates.
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type SendEmailBody = {
  from_name?: string;
  from_email?: string;
  message?: string;
  // Honeypot: a hidden field real users never fill in. Bots that
  // auto-fill every input trip it and get silently no-op'd. Deliberately
  // NOT named "company" — that matches Chrome's ORGANIZATION autofill
  // type, so a real visitor's browser could fill it and get silently
  // dropped while the UI reported success.
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 100;
const MAX_MESSAGE_LEN = 5000;

function getEmailConfig() {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, EMAIL_RECEIVER } = process.env;

  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !EMAIL_RECEIVER) {
    return null;
  }

  return {
    apiKey: RESEND_API_KEY,
    // Must be an address on a domain verified in Resend (or their
    // onboarding@resend.dev sender). Kept in env, not hardcoded, so moving
    // from the shared sender to noreply@akhyar.dev needs no code change.
    from: CONTACT_FROM_EMAIL,
    receiver: EMAIL_RECEIVER,
  };
}

// CRLF anywhere in a header-bound field lets an attacker inject extra
// mail headers (e.g. Bcc:) through the "from" display name or address.
function hasHeaderInjection(value: string) {
  return /[\r\n]/.test(value);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`send-email:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
    return Response.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: SendEmailBody;

  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { from_name, from_email, message, website } = body;

  // Honeypot tripped — pretend success so the bot doesn't learn to skip it.
  if (website) {
    return Response.json({ message: "Email sent successfully" });
  }

  if (!from_name || !from_email || !message) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  if (
    hasHeaderInjection(from_name) ||
    hasHeaderInjection(from_email) ||
    hasHeaderInjection(message)
  ) {
    return Response.json({ message: "Invalid characters in submission" }, { status: 400 });
  }

  if (from_name.length > MAX_NAME_LEN || message.length > MAX_MESSAGE_LEN) {
    return Response.json({ message: "Submission too long" }, { status: 400 });
  }

  if (!EMAIL_RE.test(from_email)) {
    return Response.json({ message: "Invalid email address" }, { status: 400 });
  }

  const emailConfig = getEmailConfig();

  if (!emailConfig) {
    // Log which ones are missing: this branch used to return 500 silently,
    // so in production logs it was indistinguishable from an SMTP failure.
    console.error(
      "Email not configured — missing env vars:",
      (["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "EMAIL_RECEIVER"] as const)
        .filter((k) => !process.env[k])
        .join(", "),
    );
    return Response.json(
      { message: "Email service is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${emailConfig.apiKey}`,
      },
      body: JSON.stringify({
        // The sender must be an address Resend has verified for us — never
        // the visitor's. Theirs goes in reply_to, so hitting Reply in the
        // inbox reaches them directly.
        from: emailConfig.from,
        to: [emailConfig.receiver],
        reply_to: `${from_name} <${from_email}>`,
        subject: `Personal Portfolio Next.JS Submission from ${from_name}`,
        text: `From: ${from_name} <${from_email}>\n\n${message}`,
      }),
      // A hung upstream call would otherwise sit until the platform kills
      // the function, turning a readable error into an opaque timeout.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // Resend returns { name, message, statusCode } on failure — log it so
      // an unverified sender domain or a revoked key is obvious from the
      // logs, but don't hand the visitor our provider's wording.
      const detail = await response.json().catch(() => null);
      console.error("Resend API error:", response.status, detail);
      return Response.json({ message: "Something went wrong" }, { status: 500 });
    }

    return Response.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
