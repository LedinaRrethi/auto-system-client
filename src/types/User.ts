export interface User {
  id: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  email: string;
  role: "Individ" | "Police" | "Specialist" | "Admin";
  status: "Pending" | "Approved" | "Rejected";
  createdOn: string;
}
