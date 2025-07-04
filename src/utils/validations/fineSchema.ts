import { z } from "zod";

const nameRegex = /^[a-zA-ZëËçÇáàéèäöüÖÜÄË\s'-]+$/;

export const fineSchema = z
  .object({
    plateNumber: z
      .string()
      .min(5, "Plate number must have at least 5 characters")
      .max(10, "Plate number cannot exceed 10 characters")
      .regex(
        /^[\p{L}\p{N}\- ]+$/u,
        "Plate number must contain only letters, numbers, spaces, or hyphens"
      ),

    fineAmount: z
      .number({ invalid_type_error: "Fine amount must be a number" })
      .min(100.01, "Fine amount must be greater than 100"),

    fineReason: z
      .string()
      .min(5, "Fine reason must be at least 5 characters")
      .max(200, "Fine reason cannot exceed 200 characters"),

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

    phoneNumber: z.string().optional(),

    personalId: z
      .string()
      .min(1, "Personal ID is required")
      .max(20, "Personal ID cannot exceed 20 characters")
      .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers are allowed"),
  })
  .superRefine((data, ctx) => {
    const hasAutoFilledFields =
      !!data.firstName?.trim() ||
      !!data.lastName?.trim() ||
      !!data.fatherName?.trim();

    if (!hasAutoFilledFields && !data.personalId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Personal ID is required when user is not registered",
        path: ["personalId"],
      });
    }
  });

export type FineCreateFormInput = z.infer<typeof fineSchema>;
