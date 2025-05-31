import { z } from "zod";

export const signUpSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  birthDate: z.date({ required_error: "Birthdate is required" }),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms.",
  }),  
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
