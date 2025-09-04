import { DocumentActionComponent } from "sanity";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import PdfDocument from "@/components/PdfDocument";

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
        <PdfDocument doc={doc} jobSnapshot={jobSnapshot} />,
      ).toBlob();

      const jobTitleSafe =
        jobSnapshot?.jobTitle?.replace(/[^a-z0-9]/gi, "_") || "document";

      saveAs(
        blob,
        `${doc.fname ?? "document"}-${doc.lname ?? ""}-${jobTitleSafe}.pdf`,
      );
      props.onComplete();
    },
  };
};
