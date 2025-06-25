import JSZip from "jszip";
import { saveAs } from "file-saver";

export const handleDownloadDocuments = async (
  documents: { documentName: string; fileBase64: string }[]
) => {
  if (documents.length === 1) {
    const doc = documents[0];
    const byteString = atob(doc.fileBase64);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: "application/pdf" });
    saveAs(blob, doc.documentName);
  } else if (documents.length > 1) {
    const zip = new JSZip();
    documents.forEach((doc) => {
      const base64Content = doc.fileBase64;
      zip.file(doc.documentName, base64Content, { base64: true });
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "inspection-documents.zip");
  }
};
