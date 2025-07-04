import { NotificationType } from "./NotificationType";

export interface Notification {
  idpK_Notification: string;
  idfK_Receiver: string;
  title?: string;
  message?: string;
  isSeen: boolean;
  type: NotificationType;
  createdBy: string;
  createdOn: string;
}
