export interface User {
  id: string;
  name: string;
  role: "Police" | "Specialist" | "Individ";    
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string; 

}

/*
export interface User {
  id: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdOn: string;
}
*/