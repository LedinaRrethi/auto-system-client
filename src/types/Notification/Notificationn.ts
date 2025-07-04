export enum NotificationnType {
  FineIssued = "FineIssued",
  InspectionResult = "InspectionResult",
  General = "General",
}

export interface Notificationn {
  idpK_Notification: string;
  idfK_Receiver: string;
  title?: string;
  message?: string;
  isSeen: boolean;
  type: NotificationnType;
  createdBy: string;
  createdOn: string;
}
