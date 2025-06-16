export interface FineTableItem {
  idpk_Fine: string;
  plateNumber: string;
  fineAmount: number;
  fineReason?: string;
  fineDate: string;
  policeFullName: string;
  recipientFullName?: string;
}
