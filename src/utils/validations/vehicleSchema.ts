import { z } from "zod";

export const vehicleSchema = z.object({
   plateNumber: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(val), {
      message: "Plate number must be in format AA123AA (2 letters, 3 numbers, 2 letters)",
    }),
    
  chassisNumber: z
    .string()
    .length(17, "Chassis number must be exactly 17 characters")
    .regex(/^[A-Z0-9]+$/, "Chassis number must contain only uppercase letters and numbers"),

  color: z
    .string()
    .min(3, "Color must be at least 3 characters")
    .max(50, "Color must be no more than 50 characters")
    .regex(/^\p{L}+$/u, "Color must contain letters only"),

  seatCount: z
    .number({ invalid_type_error: "Seat count must be a number" })
    .min(1, "Seat count must be at least 1")
    .max(60, "Seat count cannot exceed 60"),
  doorCount: z
    .number({ invalid_type_error: "Door count must be a number" })
    .min(1, "Door count must be at least 1")
    .max(5, "Door count cannot exceed 5"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
