import { VehicleStatus } from "../enums";

export interface VehicleChangeStatus {
  newStatus: VehicleStatus;
  approvalComment?: string;
}
