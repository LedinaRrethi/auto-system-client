export interface FineCreate {
  plateNumber: string;
  firstName?: string;
  fatherName?: string;
  lastName?: string;
  phoneNumber?: string;
  personalId?: string;
  fineAmount: number;
  fineReason?: string;
}