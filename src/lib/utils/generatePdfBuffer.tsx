import { pdf } from "@react-pdf/renderer";
import PdfDocument from "@/components/PdfDocument"; // Make sure file name matches exactly

export async function generatePdfBuffer(
  doc: any,
  jobSnapshot?: { jobTitle?: string; jobLocation?: string },
): Promise<Buffer> {
  // Create the PDF document

  const blob = await pdf(
    <PdfDocument doc={doc} jobSnapshot={jobSnapshot} />,
  ).toBlob();

  // Convert Blob to ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();

  // Convert ArrayBuffer to Node.js Buffer
  return Buffer.from(arrayBuffer);
}
