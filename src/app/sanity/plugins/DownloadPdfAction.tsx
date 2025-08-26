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
  section: { marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 6, fontWeight: "bold" },
  label: { fontWeight: "500" },
  listItem: { marginLeft: 12, marginBottom: 3 },
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
      .map(([k, v]) => `${k}: ${renderValue(v)}`)
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
          <View key={i} style={styles.listItem}>
            <Text>{`${k}: ${v ?? ""}`}</Text>
          </View>
        ))}
    </View>
  );
}

function renderField(label: string, value: any): JSX.Element {
  if (Array.isArray(value)) {
    return (
      <View style={styles.listItem}>
        <Text style={styles.label}>{label}</Text>
        {value.length === 0 ? (
          <Text> []</Text>
        ) : (
          value.map((item, i) => (
            <View key={i} style={styles.listItem}>
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
        <Text style={styles.label}>{label}:</Text>
        {renderObject(value)}
      </View>
    );
  }

  return (
    <Text>
      <Text style={styles.label}>{label}: </Text>
      {renderValue(value)}
    </Text>
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
            <Text style={styles.heading}>Employee Application</Text>

            {/* Job Info */}
            <View style={styles.section}>
              {/* <Text style={styles.heading}>Job Information</Text> */}
              {renderField("Job Title", jobSnapshot?.jobTitle)}
              {renderField("Job Location", jobSnapshot?.jobLocation)}
              {renderField("Date of Application", doc.dateOfApplication)}
              {renderField("First Name", doc.fname)}
              {renderField("Middle Name", doc.mname)}
              {renderField("Last Name", doc.lname)}
              {renderField("Address1", doc.address1)}
              {renderField("Address2", doc.address2)}
              {renderField("City", doc.city)}
              {renderField("State", doc.state)}
              {renderField("Zipcode", doc.zipcode)}
              {renderField("Phone", doc.phone)}
              {renderField("Email", doc.email)}
            </View>

            {/* Employment Desired Info */}
            <View style={styles.section}>
              <Text style={styles.heading}>Employment Desired</Text>
              {renderField("Position(s) Applying For", doc.positions)}
              {renderField("Are you applying for?", doc.employeeType)}
              {renderField(
                "What days and hours are you available for work?",
                doc.availability,
              )}
              {renderField(
                "Are you available to work on weekends?",
                doc.weekendAvailability,
              )}
              {renderField(
                "Would you be available to work overtime, if necessary?",
                doc.overtime,
              )}
              {renderField(
                "If hired, what date can you start work?",
                doc.startDate,
              )}
              {renderField(
                "Are you able to perform the essential job functions of the job for which you are applying with or without reasonable accommodation?",
                doc.accommodation,
              )}
              {renderField(
                "If no, describe the functions that cannot be performed. Note: We comply with the ADA and consider reasonable accommodation measures that may be necessary for qualified applicants/employees to perform essential job functions",
                doc.accommodationMessage,
              )}
            </View>

            {/* Employment Experience */}
            <View style={styles.section}>
              <Text style={styles.heading}>Employment Experience</Text>
              {renderField(
                "Have you ever been involuntarily terminated or asked to resign from any job?",
                doc.termination,
              )}
              {renderField("If yes, explain:", doc.terminationMessage)}
              {renderField(
                "Explain any gaps in your employment history:",
                doc.employmentGaps,
              )}
              {renderField(
                "List any other experience, job related skills, additional languages, or other qualifications that you believe should be considered in evaluating your qualifications for employment.",
                doc.employmentQualifications,
              )}
            </View>

            {/* Education */}
            <View style={styles.section}>
              <Text style={styles.heading}>Education</Text>
              {renderField("Highschool", doc.highschool)}
              {renderField("College", doc.college)}
              {renderField("Graduate School", doc.graduateSchool)}
              {renderField("Trade School", doc.tradeSchool)}
              {renderField("Other", doc.other)}
            </View>

            {/* References */}
            <View style={styles.section}>
              <Text style={styles.heading}>
                Business and Professional References
              </Text>
              {renderField("Business References", doc.businessReferences)}
            </View>
            <View style={styles.section}>
              <Text style={styles.heading}>Personal References</Text>
              {renderField("Personal References", doc.personalReferences)}
            </View>

            {/* General Information */}
            <View style={styles.section}>
              <Text style={styles.heading}>General Information</Text>
              {renderField(
                "If hired, would you have a reliable means of transportation to and from work?",
                doc.transportation,
              )}

              {renderField(
                "Are you at least 18 years old?",
                doc.ageRequirement,
              )}
              {renderField(
                "If hired, can you present evidence of your identity and legal right to work in this country?",
                doc.employmentAuthorization,
              )}
            </View>

            {/* Applicant Statement and Agreement */}
            <View style={styles.section}>
              <Text style={styles.heading}>
                Applicant Statement and Agreement
              </Text>
              {[
                {
                  label:
                    "I hereby authorize Ninth Ave. Foods to thoroughly investigate my references, work record, education and other matters related to my suitability for employment and, further, authorize the prior employers and references I have listed to disclose to Ninth Ave. Foods all letters, reports and other information related to my work records, without giving me prior notice of such disclosure. In addition, I hereby release Ninth Ave. Foods, my former employers and all other persons, corporations, partnerships and associations from any and all claims, demands, or liabilities arising out of or in any way related to such investigation or disclosure.",
                  value: doc.agreement1,
                },
                {
                  label:
                    "If I am employed by Ninth Ave. Foods, I understand that I am required to comply with all rules and regulations of the Ninth Ave. Foods",
                  value: doc.agreement2,
                },
                {
                  label:
                    "If hired, I understand and agree that my employment with Ninth Ave. Foods is at-will, and that neither I, nor the Ninth Ave. Foods is required to continue the employment relationship for any specific term. I further understand that the Ninth Ave. Foods or I may terminate the employment relationship at any time, with or without cause, and with or without notice. I understand that the at-will status of my employment cannot be amended, modified, or altered in any way by any oral modifications.",
                  value: doc.agreement3,
                },
                {
                  label:
                    "I hereby certify that the answers given by me are true and correct to the best of my knowledge. I further certify that I, the undersigned applicant, have personally completed this application. I understand that any omission or misstatement of material fact on this application or on any document used to secure employment shall be grounds for rejection of this application or for immediate discharge if I am employed, regardless of the time elapsed before discovery.",
                  value: doc.agreement4,
                },
                {
                  label:
                    "I understand that if I am selected for hire, it will be necessary for me to provide satisfactory evidence of my identity and legal authority to work in the United States, and that federal immigration laws require me to complete an I-9 Form in this regard.",
                  value: doc.agreement5,
                },
                {
                  label:
                    "I understand that if any term, provision, or portion of this Agreement is declared void or unenforceable, it shall be severed and the remainder of this Agreement shall be enforceable.",
                  value: doc.agreement6,
                },
              ].map(({ label, value }, i) => renderField(label, value ?? {}))}
            </View>

            {/* Employment History */}
            <View style={styles.section}>
              <Text style={styles.heading}>Employment Experiences</Text>
              {renderField("Employment Experiences", doc.employmentExperiences)}
            </View>

            {/* Electronic Signature */}
            <View style={styles.section}>
              <Text style={styles.heading}>Electronic Signature</Text>
              {renderField(
                "Sign Your Full Name (Electronic Signature):",
                doc.electronicSignature,
              )}
              {renderField("Today's Date", doc.todaysDate)}
            </View>
          </Page>
        </Document>,
      ).toBlob();

      saveAs(blob, `${doc.fname ?? "document"}-${doc.lname ?? ""}.pdf`);
      props.onComplete();
    },
  };
};
