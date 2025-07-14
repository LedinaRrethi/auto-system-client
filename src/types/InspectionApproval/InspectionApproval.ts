import { InspectionDocument } from "../InspectionDocument";

export interface InspectionApproval {
  idpK_Inspection: string;
  isPassed: boolean;
  comment?: string;
  documents: InspectionDocument[];
}