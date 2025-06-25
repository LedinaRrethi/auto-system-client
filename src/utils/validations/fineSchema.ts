import { z } from "zod";

const nameRegex = /^[a-zA-ZëËçÇáàéèäöüÖÜÄË\s'-]+$/;

export const fineSchema = z
  .object({
    plateNumber: z.string().min(1, "Plate number is required"),

    fineAmount: z
      .number({ invalid_type_error: "Fine amount must be a number" })
      .positive("Fine amount must be greater than 0"),

    fineReason: z.string().optional(),

    firstName: z
      .string()
      .optional()
      .refine((val) => !val || nameRegex.test(val), {
        message: "First name must only contain letters",
      }),

    lastName: z
      .string()
      .optional()
      .refine((val) => !val || nameRegex.test(val), {
        message: "Last name must only contain letters",
      }),

    fatherName: z
      .string()
      .optional()
      .refine((val) => !val || nameRegex.test(val), {
        message: "Father name must only contain letters",
      }),

    phoneNumber: z.string().optional(),

    personalId: z.string().optional(),
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
