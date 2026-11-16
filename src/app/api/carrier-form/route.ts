import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const entityType = formData.get("entityType");
  const operatingStatus = formData.get("operatingStatus");
  const outOfServiceDate = formData.get("outOfServiceDate");
  const legalName = formData.get("legalName");
  const dbaName = formData.get("dbaName");
  const physicalAddress = formData.get("physicalAddress");
  const phone = formData.get("phone");
  const mailingAddress = formData.get("mailingAddress");
  const usdotNumber = formData.get("usdotNumber");
  const stateCarrierId = formData.get("stateCarrierId");
  const authorityIds = formData.get("authorityIds");
  const dunsNumber = formData.get("dunsNumber");
  const powerUnits = formData.get("powerUnits");
  const drivers = formData.get("drivers");
  const mcs150Date = formData.get("mcs150Date");
  const mcs150Mileage = formData.get("mcs150Mileage");
  const operationClass = formData.get("operationClass");
  const mainContactName = formData.get("mainContactName");
  const mainContactEmail = formData.get("mainContactEmail");
  const mainContactPhone = formData.get("mainContactPhone");
  const afterHrsName = formData.get("afterHrsName");
  const afterHrsEmail = formData.get("afterHrsEmail");
  const afterHrsPhone = formData.get("afterHrsPhone");
  const files = formData
    .getAll("files")
    .filter(
      (entry): entry is File => typeof entry !== "string" && entry.size > 0,
    );

  // -----------------------------
  // Turnstile validation
  // -----------------------------

  const token = formData.get("cf-turnstile-response");
  const expectedAction = "carrier";
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  const turnstileSecret = process.env.TURNSTILE_SECRET;
  const isLocalTurnstileTest =
    process.env.NODE_ENV === "development" &&
    turnstileSecret === "1x0000000000000000000000000000000AA";

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    !turnstileSecret ||
    (!isLocalTurnstileTest && expectedHostnames.size === 0)
  ) {
    console.error("Turnstile validation failed before Siteverify:", {
      hasToken: typeof token === "string" && token.length > 0,
      tokenTooLong: typeof token === "string" && token.length > 2048,
      hasExpectedHostnames: expectedHostnames.size > 0,
    });
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
  } catch (error) {
    console.error("Turnstile Siteverify request failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        message:
          "We couldn't verify your submission. Please refresh the page and try again.",
      },
      { status: 403 },
    );
  }
  if (
    result.success !== true ||
    (!isLocalTurnstileTest &&
      (result.action !== expectedAction ||
        !expectedHostnames.has(result.hostname)))
  ) {
    console.error("Turnstile verification rejected:", {
      success: result.success,
      action: result.action,
      expectedAction,
      hostname: result.hostname,
      hostnameAllowed: expectedHostnames.has(result.hostname),
      errors: result["error-codes"],
    });
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

    const from = process.env.CARRIER_FORM_SMTP_FROM_EMAIL;
    const to = parseEnvList(process.env.CARRIER_FORM_SMTP_TO_EMAIL);

    const escapeHtml = (value: FormDataEntryValue | null): string => {
      if (typeof value !== "string" || !value.trim()) {
        return "—";
      }

      return value
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\r\n|\r|\n/g, "<br />");
    };

    const field = (label: string, value: FormDataEntryValue | null) => `
      <p style="margin:0 0 8px;">
        <strong>${label}</strong><br />
        ${escapeHtml(value)}
      </p>
    `;

    const section = (title: string, fields: string) => `
      <h2 style="margin:24px 0 12px;padding-bottom:6px;
                border-bottom:1px solid #d1d5db;font-size:18px;">
        ${title}
      </h2>
      ${fields}
    `;

    const subject = "NAF Website Carrier Inquiry";

    const html = `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Carrier Inquiry</title>
    </head>
    <body style="margin:0;padding:24px;background-color:#f4f4f5;
                font-family:Arial,sans-serif;color:#18181b;line-height:1.5;">
      <div style="max-width:640px;margin:0 auto;padding:24px;
                  background-color:#ffffff;border:1px solid #e4e4e7;">
        <h1 style="margin:0 0 8px;font-size:24px;">New Carrier Inquiry</h1>
        <p style="margin:0;">A carrier submitted its information through the Ninth Avenue Foods website.</p>

        ${section(
          "Company Information",
          `
          ${field("Legal Name", legalName)}
          ${field("DBA Name", dbaName)}
          ${field("Entity Type", entityType)}
          ${field("Physical Address", physicalAddress)}
          ${field("Mailing Address", mailingAddress)}
          ${field("Company Phone", phone)}
        `,
        )}

        ${section(
          "Carrier Registration and Operations",
          `
          ${field("Operating Status", operatingStatus)}
          ${field("Out-of-Service Date", outOfServiceDate)}
          ${field("USDOT Number", usdotNumber)}
          ${field("State Carrier ID", stateCarrierId)}
          ${field("Authority IDs", authorityIds)}
          ${field("DUNS Number", dunsNumber)}
          ${field("Power Units", powerUnits)}
          ${field("Drivers", drivers)}
          ${field("MCS-150 Date", mcs150Date)}
          ${field("MCS-150 Mileage", mcs150Mileage)}
          ${field("Operation Classification", operationClass)}
        `,
        )}

        ${section(
          "Main Contact",
          `
          ${field("Name", mainContactName)}
          ${field("Email", mainContactEmail)}
          ${field("Phone", mainContactPhone)}
        `,
        )}

        ${section(
          "After-Hours Contact",
          `
          ${field("Name", afterHrsName)}
          ${field("Email", afterHrsEmail)}
          ${field("Phone", afterHrsPhone)}
        `,
        )}

        ${section(
          "TRU ATCM Compliance",
          field(
            "Uploaded Documents",
            files.map((file) => file.name).join(", "),
          ),
        )}

        <p style="margin:24px 0 0;padding-top:12px;border-top:1px solid #d1d5db;
                  color:#52525b;font-size:13px;">
          This is an automated message from the Ninth Avenue Foods website.
        </p>
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

    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    await transporter.sendMail({
      from,
      to,
      replyTo: mainContactEmail as string,
      subject,
      text: "This is a customer inquiry from the NAF website",
      html,
      attachments: attachments,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { message: "We couldn't send your message. Please try again later." },
      { status: 500 },
    );
  }
}
