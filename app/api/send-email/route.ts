import nodemailer from "nodemailer";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type SendEmailBody = {
  from_name?: string;
  from_email?: string;
  message?: string;
  // Honeypot: a hidden field real users never fill in. Bots that
  // auto-fill every input trip it and get silently no-op'd.
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 100;
const MAX_MESSAGE_LEN = 5000;

function getEmailConfig() {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_RECEIVER } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_RECEIVER) {
    return null;
  }

  return {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
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

  const { from_name, from_email, message, company } = body;

  // Honeypot tripped — pretend success so the bot doesn't learn to skip it.
  if (company) {
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
    return Response.json(
      { message: "Email service is not configured" },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    await transporter.sendMail({
      from: `"${from_name}" <${from_email}>`,
      to: emailConfig.receiver,
      subject: `Personal Portfolio Next.JS Submission from ${from_name}`,
      text: message,
    });

    return Response.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
