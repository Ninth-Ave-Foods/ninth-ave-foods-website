import { View, Text, StyleSheet } from "@react-pdf/renderer";

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
  jobSection: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#007acc",
    backgroundColor: "#f0f8ff",
    marginBottom: 12,
  },
  jobHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007acc",
    marginBottom: 4,
  },
});

// Helper to safely convert any value to a ReactNode string
function renderValue(value: any): string {
  if (value === null || value === undefined) return "Not provided";

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
            <Text>{`${k} ${renderValue(v)}`}</Text>
          </View>
        ))}
    </View>
  );
}

function renderField(label: string, value: any): JSX.Element {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text>Not provided</Text>
      </View>
    );
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        {value.length === 0 ? (
          <Text>Not provided</Text>
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

  // Handle objects
  if (typeof value === "object") {
    return (
      <View style={styles.section}>
        {label && <Text style={styles.label}>{label}</Text>}
        {renderObject(value)}
      </View>
    );
  }

  // Handle strings, numbers, booleans, etc.
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text>{renderValue(value)}</Text>
    </View>
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
        { subLabel: "School Name", key: "schoolName" },
        { subLabel: "Years Completed", key: "yearsCompleted" },
        { subLabel: "Diploma/ Degree (Yes/No)", key: "diplomaDegree" },
        { subLabel: "Area of Study/Major", key: "major" },
        { subLabel: "Specialization", key: "specialization" },
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

function normalizeEducation(
  type: "highschool" | "college" | "graduateSchool" | "tradeSchool" | "other",
  edu?: any,
) {
  if (!edu) return undefined;

  const prefixMap: Record<string, string> = {
    highschool: "highschool",
    college: "college",
    graduateSchool: "graduateSchool",
    tradeSchool: "tradeSchool",
    other: "other",
  };

  const prefix = prefixMap[type];

  return {
    schoolName: edu[`${prefix}Name`],
    yearsCompleted: edu[`${prefix}Year`],
    diplomaDegree: edu[`${prefix}Degree`],
    major: edu[`${prefix}AreaOfStudy`],
    specialization: edu[`${prefix}Specialization`],
  };
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
    return <Text>No employment history provided</Text>;
  }

  return (
    <View>
      {experiences.map((exp, i) => (
        <View key={exp._key || i} style={{ marginBottom: 10 }}>
          <Text style={styles.subheading}>Name of Employer</Text>
          {renderField("", exp.nameofEmployer)}

          <Text style={styles.subheading}>Supervisor</Text>
          {renderField("", exp.supervisor)}

          <Text style={styles.subheading}>May we contact?</Text>
          {renderField("", exp.employerContact)}

          <Text style={styles.subheading}>Street Address</Text>
          {renderField("", exp.employerAddress)}

          <Text style={styles.subheading}>Phone Number</Text>
          {renderField("", exp.employerPhone)}

          <Text style={styles.subheading}>
            Dates Employed (Month/Year) - From
          </Text>
          {renderField("", exp.dateEmployedFrom)}

          <Text style={styles.subheading}>
            Dates Employed (Month/Year) - To
          </Text>
          {renderField("", exp.dateEmployedTo)}

          <Text style={styles.subheading}>Job Title and Duties</Text>
          {renderField("", exp.jobTitleAndDuties)}

          <Text style={styles.subheading}>Reason for Leaving</Text>
          {renderField("", exp.reasonForLeaving)}
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
    <View style={styles.section}>
      <Text style={styles.heading}>{label}</Text>
      {refs.map((ref, i) => (
        <View key={ref._key || i} style={{ marginBottom: 10 }}>
          <Text style={styles.subheading}>Name & Title</Text>
          <Text>{ref.nameAndTitle || "Not provided"}</Text>

          <Text style={styles.subheading}>Relationship</Text>
          <Text>{ref.relationship || "Not provided"}</Text>

          <Text style={styles.subheading}>Phone Number or Email</Text>
          <Text>{ref.phoneOrEmail || "Not provided"}</Text>
        </View>
      ))}
    </View>
  );
}

function renderApplicantStatements(
  statements: Array<{ text: string; accepted?: any }>,
) {
  return (
    <View>
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

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
function renderAddress(
  address1?: string,
  city?: string,
  state?: string,
  zipcode?: string,
): JSX.Element {
  const parts = [
    address1,
    [city, state].filter(Boolean).join(", "),
    zipcode,
  ].filter(Boolean);

  return (
    <View>
      {parts.length > 0 ? (
        parts.map((part, i) => <Text key={i}>{part}</Text>)
      ) : (
        <Text>Not provided</Text>
      )}
    </View>
  );
}

export {
  styles,
  renderField,
  renderEducation,
  normalizeEducation,
  renderEmploymentExperiences,
  renderReferences,
  renderApplicantStatements,
  asString,
  renderAddress,
};
