export interface Vehicle {
  idpk_Vehicle: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  status: "Pending" | "Approved" | "Rejected";
  approvalComment?: string | null;
  createdOn: string;
}
