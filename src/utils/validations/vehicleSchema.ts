import { z } from "zod";

export const vehicleSchema = z.object({
  plateNumber: z.string()
      .min(5, "Plate number must have at least 5 characters")
      .max(10, "Plate number cannot exceed 10 characters")
      .regex(
        /^[\p{L}\p{N}\- ]+$/u,
        "Plate number must contain only letters, numbers, spaces, or hyphens"
      ),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  color: z.string()
    .min(3, "Color must be at least 3 characters")
    .max(50, "Color must be no more than 50 characters"),
  seatCount: z.number({ invalid_type_error: "Seat count must be a number" })
    .min(1, "Seat count must be at least 1")
    .max(60, "Seat count cannot exceed 60"),
  doorCount: z.number({ invalid_type_error: "Door count must be a number" })
    .min(1, "Door count must be at least 1")
    .max(5, "Door count cannot exceed 5"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
