import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";

export async function POST(req: NextRequest) {
  try {
    const { filename, file } = await req.json(); // parse JSON from request body

    if (!filename || !file) {
      return NextResponse.json(
        { message: "Missing filename or file in request body" },
        { status: 400 },
      );
    }

    const from = process.env.EMPLOYEE_APP_SMTP_FROM_EMAIL;
    const to = parseEnvList(process.env.EMPLOYEE_APP_SMTP_TO_EMAIL);
    const subject = "New Entry: Employment Application Submitted";
    const body =
      "Please find the attached PDF application submitted on the NAF website";

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    });

    await transporter.verify(); // optional: verify connection

    await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      attachments: [
        {
          filename,
          content: Buffer.from(file, "base64"), // convert base64 string to buffer
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
