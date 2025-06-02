import { z } from "zod";

// Regex for password: min 9 chars, 1 uppercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;

// Names: only letters + accents
const nameRegex = /^[a-zA-ZëËçÇáàéèäöüÖÜÄË\s'-]+$/;

export const signUpSchema = z
  .object({
    fname: z
      .string()
      .min(1, "First name is required")
      .regex(nameRegex, "First name must only contain letters"),
    lname: z
      .string()
      .min(1, "Last name is required")
      .regex(nameRegex, "Last name must only contain letters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(9, "Password must be at least 9 characters long")
      .regex(
        passwordRegex,
        "Password must include 1 uppercase letter, 1 number, and 1 special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    birthDate: z
      .date({
        required_error: "Birthdate is required",
        invalid_type_error: "Birthdate must be a valid date",
      })
      .refine((val) => val <= new Date(), {
        message: "Birthdate cannot be in the future",
      }),
    acceptedTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the terms.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
