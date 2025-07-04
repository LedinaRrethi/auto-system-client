import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const inspectionRequestSchema = z.object({
  vehicleId: z.string().uuid({ message: "Please select a vehicle" }),
  directoryId: z.string().uuid({ message: "Please select a directorate" }),
  requestedDate: z
    .date({ required_error: "Date and time are required" })
    .refine((value) => value >= new Date(), {
      message: "Date and time cannot be in the past",
    }),
});

export type InspectionRequestInput = z.infer<typeof inspectionRequestSchema>;
