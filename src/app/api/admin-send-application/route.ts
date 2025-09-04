import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseEnvList } from "@/lib/PraseEnvHelpers";
import { EmployeeApplication } from "@/types";

export async function POST(request: Request) {
  try {
    // Parse JSON body as EmployeeApplication
    const application: EmployeeApplication = await request.json();

    // Build agreements HTML
    const agreementsHtml = `
  <p>Agreement 1: Initials - ${application.agreement1.initialHere1}, Statement - ${application.agreement1.statementAndAgreement1}</p>
  <p>Agreement 2: Initials - ${application.agreement2.initialHere2}, Statement - ${application.agreement2.statementAndAgreement2}</p>
  <p>Agreement 3: Initials - ${application.agreement3.initialHere3}, Statement - ${application.agreement3.statementAndAgreement3}</p>
  <p>Agreement 4: Initials - ${application.agreement4.initialHere4}, Statement - ${application.agreement4.statementAndAgreement4}</p>
  <p>Agreement 5: Initials - ${application.agreement5.initialHere5}, Statement - ${application.agreement5.statementAndAgreement5}</p>
  <p>Agreement 6: Initials - ${application.agreement6.initialHere6}, Statement - ${application.agreement6.statementAndAgreement6}</p>
`;

    // Education HTML helper
    const edu = (school: any, label: string) =>
      `<p><strong>${label}:</strong> ${school?.[`${label.toLowerCase()}Name`] || ""} (${school?.[`${label.toLowerCase()}Year`] || ""}) - ${school?.[`${label.toLowerCase()}Degree`] || ""} in ${school?.[`${label.toLowerCase()}AreaOfStudy`] || ""} ${school?.[`${label.toLowerCase()}Specialization`] || ""}</p>`;

    const educationHtml = [
      edu(application.highschool, "HighSchool"),
      edu(application.college, "College"),
      edu(application.graduateSchool, "GraduateSchool"),
      edu(application.tradeSchool, "TradeSchool"),
      edu(application.other, "Other"),
    ].join("");

    // Employment experiences HTML
    const employmentHtml = application.employmentExperiences
      ?.map(
        (exp) => `
      <p>
        Employer: ${exp.nameofEmployer}<br/>
        Supervisor: ${exp.supervisor}<br/>
        Contact: ${exp.employerContact}, ${exp.employerPhone}<br/>
        Address: ${exp.employerAddress}<br/>
        Dates: ${exp.dateEmployedFrom} - ${exp.dateEmployedTo}<br/>
        Job Title & Duties: ${exp.jobTitleAndDuties}<br/>
        Reason for Leaving: ${exp.reasonForLeaving}
      </p>
    `,
      )
      .join("");

    // References HTML helper
    const refsHtml = (refs: any[], title: string) =>
      `<h3>${title}</h3>${refs
        .map(
          (r) =>
            `<p>${r.nameAndTitle} (${r.relationship}) - ${r.phoneOrEmail}</p>`,
        )
        .join("")}`;

    // Build email HTML
    const emailHtml = `
      <h2>New Employee Application</h2>

      <h3>Personal Info</h3>
      <p><strong>Name:</strong> ${application.fname} ${application.mname} ${application.lname}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <p><strong>Date of Application:</strong> ${application.dateOfApplication}</p>
      <p><strong>Address:</strong> ${application.address1} ${application.address2}, ${application.city}, ${application.state} ${application.zipcode}</p>
      <p><strong>Positions:</strong> ${application.positions}</p>
      <p><strong>Employee Type:</strong> ${application.employeeType}</p>
      <p><strong>Availability:</strong> ${application.availability?.join(", ") || ""}</p>
      <p><strong>Weekend Availability:</strong> ${application.weekendAvailability}</p>
      <p><strong>Overtime:</strong> ${application.overtime}</p>
      <p><strong>Start Date:</strong> ${application.startDate}</p>
      <p><strong>Transportation:</strong> ${application.transportation}</p>
      <p><strong>Age Requirement:</strong> ${application.ageRequirement}</p>
      <p><strong>Employment Authorization:</strong> ${application.employmentAuthorization}</p>

      <h3>Employment Experiences</h3>
      ${employmentHtml}

      <h3>Education</h3>
      ${educationHtml}

      ${refsHtml(application.businessReferences || [], "Business References")}
      ${refsHtml(application.personalReferences || [], "Personal References")}

      <h3>Agreements</h3>
      ${agreementsHtml}

      <p><strong>Electronic Signature:</strong> ${application.electronicSignature}</p>
      <p><strong>Date:</strong> ${application.todaysDate}</p>
    `;

    // Configure NodeMailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    });

    const from = process.env.EMPLOYEE_APP_ADMIN_SMTP_FROM_EMAIL;
    const to = parseEnvList(process.env.EMPLOYEE_APP_ADMIN_SMTP_TO_EMAIL);
    const subject = "New Employee Application";

    await transporter.sendMail({ from, to, subject, html: emailHtml });

    return NextResponse.json({
      message: "Employee application email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending employee application email:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
