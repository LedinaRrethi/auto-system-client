import { ChangeRequestStatus, ChangeRequestType } from "../enums";

export interface VehicleRequestList {
  idpk_ChangeRequest: string;
  idfk_Vehicle: string;
  plateNumber: string;
  requestType: ChangeRequestType;
  status: ChangeRequestStatus;
  createdOn: string;
}
