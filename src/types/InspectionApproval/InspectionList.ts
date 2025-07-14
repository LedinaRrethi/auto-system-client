import { InspectionDocument } from "../InspectionDocument";

export interface InspectionRequestList {
  idpK_Inspection: string;
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
