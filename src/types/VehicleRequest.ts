export interface Vehicle {
  id: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  status: "Approved" | "Pending" | "Rejected";
  registrationDate: string;

  
  currentData?: Record<string, unknown>;
  requestedData?: Record<string, unknown>;
  requesterComment?: string;
}
