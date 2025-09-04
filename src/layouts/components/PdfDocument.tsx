import { Document, Page, View, Text } from "@react-pdf/renderer";
import {
  styles,
  renderField,
  renderEmploymentExperiences,
  renderEducation,
  normalizeEducation,
  renderReferences,
  renderApplicantStatements,
  renderAddress,
  asString,
} from "@/lib/utils/pdfUtils";

export const PdfDocument = ({
  doc,
  jobSnapshot,
}: {
  doc: any;
  jobSnapshot?: { jobTitle?: string; jobLocation?: string };
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.jobSection}>
        <Text style={styles.jobHeading}>Job Position</Text>
        <Text style={styles.heading}>
          {renderField("", jobSnapshot?.jobTitle || "Job title not available")}
          {renderField(
            " | ",
            jobSnapshot?.jobLocation || "Job location not available",
          )}
        </Text>
      </View>

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
        {renderAddress(
          asString(doc.address1),
          [asString(doc.city), asString(doc.state)]
            .filter(Boolean)
            .join(", ") || undefined,
          undefined, // state already included in city+state
          asString(doc.zipcode),
        )}
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
          Are you able to perform the essential job functions of the job for
          which you are applying with or without reasonable accommodation?
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
      <View style={styles.section}>
        <Text style={styles.heading}>
          Have you ever been involuntarily terminated or asked to resign from
          any job?
        </Text>
        {renderField("", doc.termination)}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          Explain any gaps in your employment history
        </Text>
        {renderField("", doc.employmentGaps)}
      </View>
      <View>
        <Text style={styles.heading}>Highschool</Text>
        {renderEducation("", normalizeEducation("highschool", doc.highschool))}
        <Text style={styles.heading}>College</Text>
        {renderEducation("", normalizeEducation("college", doc.college))}
        <Text style={styles.heading}>Graduate School</Text>
        {renderEducation(
          "",
          normalizeEducation("graduateSchool", doc.graduateSchool),
        )}
        <Text style={styles.heading}>Trade School</Text>
        {renderEducation(
          "",
          normalizeEducation("tradeSchool", doc.tradeSchool),
        )}
        <Text style={styles.heading}>Other</Text>
        {renderEducation("", normalizeEducation("other", doc.other))}
      </View>
      <View>
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
      <View>
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
          If hired, would you have a reliable means of transportation to and
          from work?
        </Text>
        {renderField("", doc.transportation)}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Are you at least 18 years old?</Text>
        {renderField("", doc.ageRequirement)}
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          If hired, can you present evidence of your identity and legal right to
          work in this country?
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
  </Document>
);

export default PdfDocument;
