import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";
import { generatePdfBuffer } from "@/lib/utils/generatePdfBuffer";

export async function POST(req: NextRequest) {
  try {
    // Read request body ONCE
    const { applicationData, jobTitle, jobLocation } = await req.json();

    if (!applicationData || !jobTitle || !jobLocation) {
      return NextResponse.json(
        { message: "Missing application data in request body" },
        { status: 400 },
      );
    }

    const pdfBuffer = await generatePdfBuffer(applicationData, {
      jobTitle,
      jobLocation,
    });
    const safeFilePart = (value: string) =>
      value
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
    const filename = `${safeFilePart(applicationData.fname)}-${safeFilePart(applicationData.lname)}-${safeFilePart(jobTitle || "Application")}.pdf`;

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

    try {
      await transporter.verify(); // optional: verify connection

      await transporter.sendMail({
        from,
        to,
        subject,
        text: body,
        attachments: [
          {
            filename,
            content: pdfBuffer, // already a Buffer
            contentType: "application/pdf",
          },
        ],
      });
    } catch (error) {
      console.error("Employee application EMAIL failed:", {
        message: error instanceof Error ? error.message : "Unknown error",
      });

      return NextResponse.json(
        {
          message:
            "The application was processed, but the email could not be sent.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Employee application PROCESSING failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        message: "The application could not be processed.",
      },
      { status: 500 },
    );
  }
}
