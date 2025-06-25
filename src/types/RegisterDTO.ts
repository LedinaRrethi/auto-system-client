export interface RegisterDTO {
  firstName: string;
  fatherName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  specialistNumber?: string;
  directorateId?: string;
  personalId?: string;
}

export enum UserRole {
  Individ = 0,
  Police = 1,
  Specialist = 2,
}
