import { DocumentActionComponent } from "sanity";
import { saveAs } from "file-saver";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, lineHeight: 1.4 },
  section: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  employmentBlock: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  heading: {
    fontSize: 12,
    marginBottom: 6,
    paddingBottom: 4,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  label: { fontWeight: "400" },
  listItem: { marginLeft: 12, marginBottom: 6 },
});

// Helper to safely convert any value to a ReactNode string
function renderValue(value: any): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    // If it's an array, flatten each item
    if (Array.isArray(value)) {
      return value.map((v) => renderValue(v)).join("\n");
    }
    // If it's an object, skip _key and flatten to string
    return Object.entries(value)
      .filter(([k]) => k !== "_key")
      .map(([k, v]) => `${renderValue(v)}`)
      .join("\n");
  }

  return String(value);
}

function renderObject(value: Record<string, any>): JSX.Element {
  return (
    <View>
      {Object.entries(value)
        .filter(([k]) => k !== "_key")
        .map(([k, v], i) => (
          <View key={i}>
            <Text>{`${k} ${v ?? ""}`}</Text>
          </View>
        ))}
    </View>
  );
}

function renderField(label: string, value: any): JSX.Element {
  if (Array.isArray(value)) {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        {value.length === 0 ? (
          <Text> []</Text>
        ) : (
          value.map((item, i) => (
            <View key={i}>
              <Text>{renderValue(item)}</Text>
            </View>
          ))
        )}
      </View>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <View style={styles.section}>
        <Text style={styles.label}>{label}</Text>
        {renderObject(value)}
      </View>
    );
  }

  return (
    <Text>
      <Text style={styles.label}>{label}</Text>
      {renderValue(value)}
    </Text>
  );
}

type EducationRecord = {
  [key: string]: string;
};

function renderEducation(label: string, edu?: EducationRecord): JSX.Element {
  if (!edu) {
    return (
      <View style={styles.heading}>
        <Text style={styles.label}>{label}: </Text>
        <Text>Not provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{label}</Text>

      {[
        { subLabel: "School Name: ", key: "schoolName" },
        { subLabel: "Years Completed: ", key: "yearsCompleted" },
        { subLabel: "Diploma/ Degree (Yes/No): ", key: "diplomaDegree" },
        { subLabel: "Area of Study/Major: ", key: "major" },
        { subLabel: "Specialization: ", key: "specialization" },
      ].map(({ subLabel, key }) => (
        <View key={key}>
          <Text>
            <Text style={styles.subheading}>{subLabel}</Text>
          </Text>

          {edu && edu[key] ? (
            renderField("", edu[key])
          ) : (
            <Text>
              <Text>Not provided</Text>
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

function renderEmploymentExperiences(
  experiences: Array<{
    _key: string;
    nameofEmployer: string;
    supervisor: string;
    employerContact: string;
    employerAddress: string;
    employerPhone: string;
    dateEmployedFrom: string;
    dateEmployedTo: string;
    jobTitleAndDuties: string;
    reasonForLeaving: string;
  }> = [],
): JSX.Element {
  if (!experiences.length) {
    return <Text>No employment history provided.</Text>;
  }

  return (
    <View>
      {experiences.map((exp, i) => (
        <View key={exp._key || i} style={styles.section}>
          <Text>
            <Text style={styles.subheading}>Name of Employer: </Text>
            {renderField("", exp.nameofEmployer)}
          </Text>

          <Text>
            <Text style={styles.subheading}>Supervisor: </Text>
            {renderField("", exp.supervisor)}
          </Text>

          <Text>
            <Text style={styles.subheading}>May we contact?</Text>
            {renderField("", exp.employerContact)}
          </Text>

          <Text>
            <Text style={styles.subheading}>Street Address</Text>
            {renderField("", exp.employerAddress)}
          </Text>

          <Text>
            <Text style={styles.subheading}>Phone Number</Text>
            {renderField("", exp.employerPhone)}
          </Text>

          <Text>
            <Text style={styles.subheading}>
              Dates Employed (Month/Year) - From
            </Text>
            {renderField("", exp.dateEmployedFrom)}
          </Text>

          <Text>
            <Text style={styles.subheading}>
              Dates Employed (Month/Year) - To
            </Text>
            {renderField("", exp.dateEmployedTo)}
          </Text>

          <Text>
            <Text style={styles.subheading}>Job Title and Duties</Text>
            {renderField("", exp.jobTitleAndDuties)}
          </Text>

          <Text>
            <Text style={styles.heading}>Reason for Leaving</Text>
            {renderField("", exp.reasonForLeaving)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderReferences(
  label: string,
  refs: Array<{
    _key: string;
    nameAndTitle?: string;
    relationship?: string;
    phoneOrEmail?: string;
  }> = [],
): JSX.Element {
  if (!refs.length) {
    return (
      <View style={styles.section}>
        <Text style={styles.label}>{label}: </Text>
        <Text>Not provided</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.heading}>{label}</Text>
      {refs.map((ref, i) => (
        <View key={ref._key || i}>
          <Text>
            <Text style={styles.subheading}>Name & Title: </Text>
            {ref.nameAndTitle || ""}
          </Text>
          <Text>
            <Text style={styles.subheading}>
              Relationship and Years Acquainted:{" "}
            </Text>
            {ref.relationship || ""}
          </Text>
          <Text>
            <Text style={styles.subheading}>Phone Number or Email: </Text>
            {ref.phoneOrEmail || ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderApplicantStatements(
  statements: Array<{ text: string; accepted?: any }>,
) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Applicant Statement and Agreement</Text>

      {statements.map((statement, i) => {
        const accepted = statement.accepted || {};
        const initial = accepted[`initialHere${i + 1}`] ?? "Not provided";
        const agreement =
          accepted[`statementAndAgreement${i + 1}`] ?? "Not provided";

        return (
          <View key={i} style={styles.section}>
            <Text>{statement.text}</Text>
            <Text>
              <Text style={styles.subheading}>Initial added: </Text>
              {initial}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export const DownloadPdfAction: DocumentActionComponent = (props) => {
  return {
    label: "Download as PDF",
    onHandle: async () => {
      const doc = props.draft || props.published;
      if (!doc) {
        alert("No document to export");
        props.onComplete();
        return;
      }

      const jobSnapshot = doc.jobSnapshot as
        | { jobTitle?: string; jobLocation?: string }
        | undefined;

      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.heading}>Date of Application</Text>
              {renderField("", doc.dateOfApplication)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Name</Text>
              {renderField("", doc.fname + " " + doc.mname + " " + doc.lname)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Address</Text>
              {renderField("Address 1: ", doc.address1)}
              {renderField("Address 2: ", doc.address2)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Phone</Text>
              {renderField("", doc.phone)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Email</Text>
              {renderField("", doc.email)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Position(s) Applying For</Text>
              {renderField("", doc.positions)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Are you applying for?</Text>
              {renderField("", doc.employeeType)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                What days and hours are you available for work?
              </Text>
              {renderField("", doc.availability)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Are you available to work on weekends?
              </Text>
              {renderField("", doc.weekendAvailability)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Are you available to work on weekends?
              </Text>
              {renderField("", doc.weekendAvailability)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Would you be available to work overtime, if necessary?
              </Text>
              {renderField("", doc.overtime)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                If hired, what date can you start work?
              </Text>
              {renderField("", doc.startDate)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Are you able to perform the essential job functions of the job
                for which you are applying with or without reasonable
                accommodation?
              </Text>
              {renderField("", doc.accommodation)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Employment Experiences</Text>
              {renderEmploymentExperiences(
                doc.employmentExperiences as Array<{
                  _key: string;
                  nameofEmployer: string;
                  supervisor: string;
                  employerContact: string;
                  employerAddress: string;
                  employerPhone: string;
                  dateEmployedFrom: string;
                  dateEmployedTo: string;
                  jobTitleAndDuties: string;
                  reasonForLeaving: string;
                }>,
              )}
            </View>
            <View>
              <Text style={styles.heading}>
                Have you ever been involuntarily terminated or asked to resign
                from any job?
              </Text>
              {renderField("", doc.termination)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Explain any gaps in your employment history:
              </Text>
              {renderField("", doc.employmentGaps)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Highschool</Text>
              {renderEducation("", doc.highschool as EducationRecord)}
              <Text style={styles.heading}>College</Text>
              {renderEducation("", doc.college as EducationRecord)}
              <Text style={styles.heading}>Graduate School</Text>
              {renderEducation("", doc.graduateSchool as EducationRecord)}
              <Text style={styles.heading}>Trade School</Text>
              {renderEducation("", doc.tradeSchool as EducationRecord)}
              <Text style={styles.heading}>Other</Text>
              {renderEducation("", doc.other as EducationRecord)}
            </View>
            <View style={styles.section}>
              {renderReferences(
                "Business and Professional References",
                doc.businessReferences as Array<{
                  _key: string;
                  nameAndTitle?: string;
                  relationship?: string;
                  phoneOrEmail?: string;
                }>,
              )}
            </View>
            <View style={styles.section}>
              {renderReferences(
                "Personal References",
                doc.personalReferences as Array<{
                  _key: string;
                  nameAndTitle?: string;
                  relationship?: string;
                  phoneOrEmail?: string;
                }>,
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                If hired, would you have a reliable means of transportation to
                and from work?
              </Text>
              {renderField("", doc.transportation)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Are you at least 18 years old?</Text>
              {renderField("", doc.ageRequirement)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                If hired, can you present evidence of your identity and legal
                right to work in this country?
              </Text>
              {renderField("", doc.employmentAuthorization)}
            </View>
            <View>
              {renderApplicantStatements([
                {
                  text: "I hereby authorize Ninth Ave. Foods to thoroughly investigate my references, work record, education and other matters related to my suitability for employment and, further, authorize the prior employers and references I have listed to disclose to Ninth Ave. Foods all letters, reports and other information related to my work records, without giving me prior notice of such disclosure. In addition, I hereby release Ninth Ave. Foods, my former employers and all other persons, corporations, partnerships and associations from any and all claims, demands, or liabilities arising out of or in any way related to such investigation or disclosure.",
                  accepted: doc.agreement1,
                },
                {
                  text: "If I am employed by Ninth Ave. Foods, I understand that I am required to comply with all rules and regulations of the Ninth Ave. Foods",
                  accepted: doc.agreement2,
                },
                {
                  text: "If hired, I understand and agree that my employment with Ninth Ave. Foods is at-will, and that neither I, nor the Ninth Ave. Foods is required to continue the employment relationship for any specific term. I further understand that the Ninth Ave. Foods or I may terminate the employment relationship at any time, with or without cause, and with or without notice. I understand that the at-will status of my employment cannot be amended, modified, or altered in any way by any oral modifications.",
                  accepted: doc.agreement3,
                },
                {
                  text: "I hereby certify that the answers given by me are true and correct to the best of my knowledge. I further certify that I, the undersigned applicant, have personally completed this application. I understand that any omission or misstatement of material fact on this application or on any document used to secure employment shall be grounds for rejection of this application or for immediate discharge if I am employed, regardless of the time elapsed before discovery.",
                  accepted: doc.agreement4,
                },
                {
                  text: "I understand that if I am selected for hire, it will be necessary for me to provide satisfactory evidence of my identity and legal authority to work in the United States, and that federal immigration laws require me to complete an I-9 Form in this regard.",
                  accepted: doc.agreement5,
                },
                {
                  text: "I understand that if any term, provision, or portion of this Agreement is declared void or unenforceable, it shall be severed and the remainder of this Agreement shall be enforceable.",
                  accepted: doc.agreement6,
                },
              ])}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>
                Sign Your Full Name (Electronic Signature):
              </Text>
              {renderField("", doc.electronicSignature)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Today's Date</Text>

              {renderField("", doc.todaysDate)}
            </View>
          </Page>
        </Document>,
      ).toBlob();

      saveAs(blob, `${doc.fname ?? "document"}-${doc.lname ?? ""}.pdf`);
      props.onComplete();
    },
  };
};
