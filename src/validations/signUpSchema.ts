import { z } from "zod";

export const signUpSchema = z
  .object({
    fname: z.string().min(1, "First name is required").regex(/^[A-Za-z]+$/, "Only letters are allowed"),
    lname: z.string().min(1, "Last name is required").regex(/^[A-Za-z]+$/, "Only letters are allowed"),
    email: z.string().min(1, "Email is required").email("Email format is invalid"),
    password: z.string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must include one uppercase letter")
      .regex(/[0-9]/, "Must include one number")
      .regex(/[^A-Za-z0-9]/, "Must include one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    birthDate: z.preprocess((val) => {
      if (val instanceof Date && !isNaN(val.getTime())) return val;
      if (typeof val === "string" || typeof val === "number") return new Date(val);
      return undefined;
    }, z.date({ required_error: "Birthdate is required" })),
    acceptedTerms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
