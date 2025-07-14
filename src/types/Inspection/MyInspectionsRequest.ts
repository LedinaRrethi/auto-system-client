import { InspectionDocument } from "../InspectionDocument";

export interface MyInspectionsRequest {
  idpk_InspectionRequest: string;
  plateNumber: string;
  requestedDate: string; 
  directorateName: string;
  status: string;
  comment?: string;
  documents: InspectionDocument[];
}