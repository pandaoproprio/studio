// @/lib/actions.ts
"use server";

import {
  generateImpactReport,
  GenerateImpactReportInput,
  GenerateImpactReportOutput,
} from "@/ai/flows/generate-impact-report";
import {
  getAccountStatusSummary,
  AccountStatusSummaryInput,
  AccountStatusSummaryOutput,
} from "@/ai/flows/account-status-summary";
import { z } from "zod";

const impactReportSchema = z.object({
  projectDescription: z.string().min(10, "Project description is too short."),
  projectOutcomes: z.string().min(10, "Project outcomes are too short."),
  desiredReportSections: z.string().min(3, "Please provide at least one section."),
});

type ImpactReportState = {
  message: string;
  data?: GenerateImpactReportOutput;
  errors?: {
    projectDescription?: string[];
    projectOutcomes?: string[];
    desiredReportSections?: string[];
  };
};

export async function generateImpactReportAction(
  prevState: ImpactReportState,
  formData: FormData
): Promise<ImpactReportState> {
  const validatedFields = impactReportSchema.safeParse({
    projectDescription: formData.get("projectDescription"),
    projectOutcomes: formData.get("projectOutcomes"),
    desiredReportSections: formData.get("desiredReportSections"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateImpactReport(validatedFields.data);
    return { message: "Report generated successfully.", data: result };
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }
}

type AccountStatusState = {
    message: string;
    data?: AccountStatusSummaryOutput;
    error?: string;
};

export async function getAccountStatusSummaryAction(): Promise<AccountStatusState> {
    try {
        const input: AccountStatusSummaryInput = { tenantId: 'tenant-123' }; // Dummy tenant ID
        const result = await getAccountStatusSummary(input);
        return { message: "Summary loaded.", data: result };
    } catch(e) {
        console.error(e);
        return { message: "Failed to load summary.", error: "An unexpected error occurred."};
    }
}
