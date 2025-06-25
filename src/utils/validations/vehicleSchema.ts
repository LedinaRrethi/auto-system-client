import { z } from "zod";

export const vehicleSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  color: z.string().min(1, "Color is required"),
  seatCount: z.number().min(1, "Seat count must be at least 1"),
  doorCount: z.number().min(1, "Door count must be at least 1"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
