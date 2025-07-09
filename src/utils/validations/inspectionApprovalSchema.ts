import { z } from "zod";

export const inspectionApprovalSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment is required." })
    .min(5, { message: "Comment must be at least 5 characters long." }),
  files: z
    .array(z.instanceof(File)
      .refine(file => file.type === "application/pdf", { message: "Only PDF files are allowed." }))
    .min(1, { message: "At least one PDF file is required." })
    .refine((files) => {
      const names = files.map(f => f.name.toLowerCase());
      return new Set(names).size === names.length;
    }, { message: "Duplicate file names are not allowed." })
});

export type InspectionApprovalInput = z.infer<typeof inspectionApprovalSchema>;
