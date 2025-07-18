import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const nameRegex = /^[a-zA-ZëËçÇáàéèäöüÖÜÄË'-]+$/;

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .regex(nameRegex, "Only letters allowed"),
    fatherName: z
      .string()
      .min(1, "Father name is required")
      .max(50, "Father name cannot exceed 50 characters")
      .regex(nameRegex, "Only letters allowed"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .regex(nameRegex, "Only letters allowed"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address (e.g., name@gmail.com)."),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        passwordRegex,
        "Must include 1 uppercase, 1 number, and 1 special character"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    birthDate: z
      .date({ required_error: "Birthdate is required" })
      .refine((d) => d <= new Date(), {
        message: "Birthdate cannot be in the future",
      }),

    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms.",
    }),

    role: z.enum(["Individ", "Police", "Specialist"], {
      required_error: "Role is required",
    }),

    specialistNumber: z
      .string()
      .max(20, "Specialist number cannot exceed 50 characters")
      .optional()
      .refine((val) => !val || !val.includes(" "), {
        message: "Specialist number must not contain spaces",
      }),

    directorate: z.string().optional(),

    personalId: z
      .string()
      .min(1, "Personal ID is required")
      .regex(/^[A-Za-z]{1}[0-9]{8}[A-Za-z]{1}$/, "Personal ID must be 1 letter, 8 digits, 1 letter (e.g. A12345678Z)"),
  })

  .superRefine((data, ctx) => {
    if (data.role === "Specialist") {
      if (!data.specialistNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Specialist number is required",
          path: ["specialistNumber"],
        });
      }

      if (!data.directorate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Directorate is required",
          path: ["directorate"],
        });
      }
    }
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
