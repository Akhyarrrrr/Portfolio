import nodemailer from "nodemailer";

type SendEmailBody = {
  from_name?: string;
  from_email?: string;
  message?: string;
};

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

export async function POST(req: Request) {
  let body: SendEmailBody;

  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { from_name, from_email, message } = body;

  if (!from_name || !from_email || !message) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
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
