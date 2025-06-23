export interface MyInspectionsRequest {
  idpk_InspectionRequest: string;
  plateNumber: string;
  requestedDate: string; 
  directorateName: string;
  status: string;
  comment?: string;
  documents: InspectionDocDTO[];
}

export interface InspectionDocDTO {
  idpk_InspectionDoc: string;
  documentName: string;
  fileBase64: string;
}
