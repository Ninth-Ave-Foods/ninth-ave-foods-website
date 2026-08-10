import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const firstName = formData.get("fname");
  const lastName = formData.get("lname");
  const email = formData.get("email");
  const interest = formData.get("interest");
  const message = formData.get("message");

  // -----------------------------
  // Turnstile validation
  // -----------------------------

  const token = formData.get("cf-turnstile-response");
  const expectedAction = "contact";
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    expectedHostnames.size === 0
  ) {
    return NextResponse.json(
      {
        message:
          "We couldn't verify your submission. Please refresh the page and try again.",
      },
      { status: 403 },
    );
  }

  let result;

  try {
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET!,
          response: token,
        }),
      },
    );
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch {
    return NextResponse.json(
      {
        message:
          "We couldn't verify your submission. Please refresh the page and try again.",
      },
      { status: 403 },
    );
  }
  if (
    !result.success ||
    result.action !== expectedAction ||
    !expectedHostnames.has(result.hostname)
  ) {
    return NextResponse.json(
      {
        message:
          "We couldn't verify your submission. Please refresh the page and try again.",
      },
      { status: 403 },
    );
  }

  try {
    // -----------------------------------
    // Turnstile passed — send the email
    // -----------------------------------

    const from = process.env.CONTACT_FORM_SMTP_FROM_EMAIL;
    const to = parseEnvList(process.env.CONTACT_FORM_SMTP_TO_EMAIL);

    const subject = "NAF Website Customer Inquiry";

    const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Customer Inquiry</title>
      <meta name="description" content="Customer Inquiry" />
      <style>
        body { font-family: "Gill Sans", sans-serif; color: #18181b; }
        .container { margin: 0 20px; }
        div { font-size: 16px; }
        .field { font-weight: bold; }
        .footer { font-size: 16px; padding-bottom: 20px; border-bottom: 1px solid #d1d5db; }
        .footer-links { display: flex; justify-content: center; align-items: center; color: #9ca3af; }
        a { text-decoration: none; margin: 8px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <h2>Customer inquiry from the NAF website</h2>
      <div class="container">
        <h4>✉️ You've got a new message from ${firstName} ${lastName}</h4>
        <div>
          <h3>Customer Inquiry ❓</h3>
          <p>👤 <span class="field">Full Name: </span>${firstName} ${lastName}</p>
          <p>📧 <span class="field">Email address: </span> <a href="mailto:${email}">${email}</a></p>
          <p>✨ <span class="field">Area of Interest: </span>${interest}</p>
          <p>🗨️ <span class="field">Message: </span>${message}</p>
        </div>
        <div class="footer"></div>
        <div class="footer-links">
          <p>This is an automated message sent by the Ninth Ave Foods website</p>
        </div>
      </div>
    </body>
  </html>`;

    // Configure Nodemailer SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    await transporter.sendMail({
      from,
      to,
      replyTo: email as string,
      subject,
      text: "This is a customer inquiry from the NAF website",
      html,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "We couldn't send your message. Please try again later." },
      { status: 500 },
    );
  }
}
