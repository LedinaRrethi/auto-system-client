import { z } from "zod";

export const fineSchema = z.object({
  plateNumber: z
    .string()
    .min(1, "Targa është e detyrueshme.")
    .regex(/^[A-Z0-9]+$/, "Targa nuk duhet të përmbajë hapësira ose karaktere jo të lejuara."),

  fineAmount: z
    .number({ invalid_type_error: "Shuma duhet të jetë numër." })
    .min(1, "Shuma duhet të jetë më e madhe se 0."),

  fineReason: z
    .string()
    .max(250, "Reason nuk mund të jetë më e gjatë se 250 karaktere.")
    .optional()
    .or(z.literal("")),

  firstName: z
    .string()
    .min(1, "Emri është i detyrueshëm.")
    .regex(/^[A-Za-zëËçÇ ]+$/, "Emri nuk mund të përmbajë numra ose simbole."),

  lastName: z
    .string()
    .min(1, "Mbiemri është i detyrueshëm.")
    .regex(/^[A-Za-zëËçÇ ]+$/, "Mbiemri nuk mund të përmbajë numra ose simbole."),

  fatherName: z
    .string()
    .regex(/^[A-Za-zëËçÇ ]*$/, "Emri i babait nuk mund të përmbajë numra ose simbole.")
    .optional()
    .or(z.literal("")),

  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Numri i telefonit duhet të jetë i vlefshëm.")
    .optional()
    .or(z.literal("")),

  personalId: z
    .string()
    .regex(/^[A-Z0-9]{5,20}$/, "ID personale duhet të përmbajë vetëm shkronja dhe numra.")
    .optional()
    .or(z.literal("")),
});
