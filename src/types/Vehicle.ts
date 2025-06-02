export interface Vehicle {
  id: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  status: "Pending" | "Approved" | "Rejected";
}