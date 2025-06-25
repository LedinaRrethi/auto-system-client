import { z } from "zod";

export const inspectionRequestSchema = z.object({
  vehicleId: z.string().uuid({ message: "Please select a vehicle" }),
  directoryId: z.string().uuid({ message: "Please select a directorate" }),
  requestedDate: z.date({ required_error: "Date is required" }),
});

export type InspectionRequestInput = z.infer<typeof inspectionRequestSchema>;
