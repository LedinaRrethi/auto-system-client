export interface InspectionDocument {
  idpk_InspectionDoc: string;
  idfk_InspectionRequest: string;
  documentName: string;
  fileBase64: string;
}

export interface InspectionRequestList {
  idpK_InspectionRequest: string;
  plateNumber: string;
  requestedDate: string;
  inspectionDate: string;
  inspectionTime: string;
  status: string;
  comment?: string;
  isPassed?: boolean;
  documents: InspectionDocument[];
}
