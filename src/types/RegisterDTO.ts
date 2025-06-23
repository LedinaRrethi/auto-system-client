export interface RegisterDTO {
  id: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  personalId: string;
  password: string;
  confirmPassword: string;
  role: "Individ" | "Police" | "Specialist";
  status: "Pending" | "Approved" | "Rejected";
  specialistNumber?: string;
  directorateId?: string;
}
