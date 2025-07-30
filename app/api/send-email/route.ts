import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { from_name, from_email, message } = body;

  console.log("REQ BODY:", { from_name, from_email, message });
  console.log("ENV:", {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_RECEIVER: process.env.EMAIL_RECEIVER,
  });

  if (!from_name || !from_email || !message) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${from_name}" <${from_email}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `Personal Portfolio Next.JS Submission from ${from_name}`,
      text: message,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error.message, error);
    return new Response(
      JSON.stringify({ message: error.message || "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
