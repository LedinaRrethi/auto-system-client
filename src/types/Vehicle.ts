export interface Vehicle {
  id: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  status: "Pending" | "Approved" | "Rejected";
  approvalComment?: string | null; // Comment from the admin if any
  invalidated: boolean; // Indicates if the vehicle is invalidated
  registrationDate: string; // ISO date string
}