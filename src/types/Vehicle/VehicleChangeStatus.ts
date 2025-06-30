import { VehicleStatus } from "../enums";

export interface VehicleChangeStatus {
  newStatus: VehicleStatus;
  adminComment?: string;
}
