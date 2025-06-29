import { VehicleStatus } from "../enums";

export interface Vehicle {
  idpk_Vehicle: string;
  plateNumber: string;
  color: string;
  seatCount: number;
  doorCount: number;
  chassisNumber: string;
  status: VehicleStatus;
  createdOn: string;
}
