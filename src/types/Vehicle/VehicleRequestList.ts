import { ChangeRequestType, VehicleStatus } from "../enums";

export interface VehicleRequestList {
  idpK_ChangeRequest: string;
  idfK_Vehicle: string;
  plateNumber: string;
  requestType: ChangeRequestType;
  status: VehicleStatus;
  requestDataJson: string;
  currentDataSnapshotJson: string;
  createdOn: string;
}
