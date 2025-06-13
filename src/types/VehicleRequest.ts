export interface VehicleRequest {
  id: string;
  plateNumber: string;
  requesterName: string;
  requestType: "Register" | "Update" | "Delete";
  requestDataJson: string; 
  currentDataSnapshotJson: string; 
  status: "Pending" | "Approved" | "Rejected";
  adminComment: string| null; 
  createdOn: string; // ISO date string
  
}       
  