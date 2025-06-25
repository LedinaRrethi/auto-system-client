import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const simpleNameRegex = /^[a-zA-ZëËçÇáàéèäöüÖÜÄË'-]+$/;

export const signUpSchema = z
  .object({
    fname: z.string().min(1, "First name is required").regex(simpleNameRegex, "Only letters allowed, no spaces"),
    fathername: z.string().min(1, "Father name is required").regex(simpleNameRegex, "Only letters allowed, no spaces"),
    lname: z.string().min(1, "Last name is required").regex(simpleNameRegex, "Only letters allowed, no spaces"),

    email: z.string().email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(passwordRegex, "Must include 1 uppercase, 1 number, and 1 special character"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    birthDate: z.date({ required_error: "Birthdate is required" }).refine((d) => d <= new Date(), {
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
      .optional()
      .refine((val) => !val || !val.includes(" "), {
        message: "Specialist number must not contain spaces",
      }),

    directorate: z.string().optional(),

    personalId: z.string().length(10, "Personal ID must be exactly 10 characters"),
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
