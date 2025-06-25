export interface FineResponse {
  idpk_Fine: string;
  fineAmount: number;
  fineReason: string | null;
  fineDate: string;
  policeFullName: string;
  recipientFullName?: string;
  plateNumber?: string;
}