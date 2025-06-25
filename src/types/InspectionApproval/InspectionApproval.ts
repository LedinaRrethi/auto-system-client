export interface InspectionApproval {
  idpK_Inspection: string;
  isPassed: boolean;
  comment?: string;
  documents: {
    idfK_InspectionRequest: string;
    documentName: string;
    fileBase64: string;
  }[];
}