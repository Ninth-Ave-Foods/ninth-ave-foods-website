import nodemailer from "nodemailer";

app.post("/api/send-pdf-email", async (req, res) => {
  const { to, subject, body, filename, file } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    auth: { user: "your_email", pass: "your_password" },
  });

  await transporter.sendMail({
    from: '"Ninth Ave Foods" <no-reply@ninthavefoods.com>',
    to,
    subject,
    text: body,
    attachments: [
      {
        filename,
        content: Buffer.from(file, "base64"),
        contentType: "application/pdf",
      },
    ],
  });

  res.send({ success: true });
});

// api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";

export async function POST(req: NextRequest) {
  const from = process.env.SMTP_FROM_EMAIL;
  const to = parseEnvList(process.env.SMTP_TO_EMAIL);
  const subject = "New Entry: Employment Application Submitted";

  try {
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
      subject,
      text: body,
      attachments: [
        {
          filename,
          content: Buffer.from(file, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
