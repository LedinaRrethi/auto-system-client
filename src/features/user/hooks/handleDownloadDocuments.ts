import JSZip from "jszip";
import { saveAs } from "file-saver";
import { fetchInspectionDocument } from "../../../services/inspectionService";
import { InspectionDocument } from "../../../types/InspectionDocument";

export const handleDownloadDocuments = async (
  documents: InspectionDocument[]
) => {
  const documentsWithContent: { documentName: string; fileBase64: string }[] = [];

  for (const doc of documents) {
    try {

      if (doc.idpK_InspectionDoc) {
  const { fileBase64 } = await fetchInspectionDocument(doc.idpK_InspectionDoc);
     documentsWithContent.push({
        documentName: doc.documentName,
        fileBase64,
      });

}

    } catch (error) {
      console.error("Failed to fetch fileBase64 for document:", doc.documentName, error);
    }
  }

  if (documentsWithContent.length === 0) return;

  if (documentsWithContent.length === 1) {
    const doc = documentsWithContent[0];
    const byteString = atob(doc.fileBase64);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: "application/pdf" });
    saveAs(blob, doc.documentName);
  } else {
    const zip = new JSZip();
    documentsWithContent.forEach((doc) => {
      zip.file(doc.documentName, doc.fileBase64, { base64: true });
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "inspection-documents.zip");
  }
};
