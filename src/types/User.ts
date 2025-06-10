export interface User {
  id: string;
  name: string;
  role: "Police" | "Specialist" | "Individ";    
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string; 

}