import { VehicleStatus } from "../enums";

export interface Vehicle {
  idpK_Vehicle: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  approvalComment: string | null;
  status: VehicleStatus;
  createdOn: string;
}
