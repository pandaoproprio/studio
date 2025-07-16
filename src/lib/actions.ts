// @/lib/actions.ts
"use server";

import {
  generateImpactReport,
  GenerateImpactReportInput,
  GenerateImpactReportOutput,
} from "@/ai/flows/generate-impact-report";
import {
  generateProgressReport,
  GenerateProgressReportInput,
  GenerateProgressReportOutput,
} from "@/ai/flows/generate-progress-report";
import {
  getAccountStatusSummary,
  AccountStatusSummaryInput,
  AccountStatusSummaryOutput,
} from "@/ai/flows/account-status-summary";
import { summarizePost } from "@/ai/flows/summarize-post";
import type { SummarizePostOutput } from "@/ai/schemas/summarize-post-schemas";
import {
  describeColaboradorProfile,
  DescribeColaboradorProfileInputSchema,
  type DescribeColaboradorProfileInput,
  type DescribeColaboradorProfileOutput
} from "@/ai/flows/describe-profile";
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

const progressReportSchema = z.object({
    projectId: z.string().min(1, "Por favor, selecione um projeto."),
    projectName: z.string(),
    tasksTodo: z.string().transform(val => JSON.parse(val)),
    tasksInProgress: z.string().transform(val => JSON.parse(val)),
    tasksDone: z.string().transform(val => JSON.parse(val)),
});

type ProgressReportState = {
    message: string;
    data?: GenerateProgressReportOutput;
    errors?: {
        projectId?: string[];
        projectData?: string[];
    };
};

export async function generateProgressReportAction(
    prevState: ProgressReportState,
    formData: FormData
): Promise<ProgressReportState> {
    const rawData = {
        projectId: formData.get("projectId"),
        projectName: formData.get("projectName"),
        tasksTodo: formData.get("tasksTodo"),
        tasksInProgress: formData.get("tasksInProgress"),
        tasksDone: formData.get("tasksDone"),
    };

    if (!rawData.projectName) {
         return {
            message: "Por favor, selecione um projeto para carregar os dados.",
            errors: { projectId: ["Selecione um projeto válido."] }
         }
    }

    const validatedFields = progressReportSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
        return {
            message: "Falha na validação. Certifique-se de que um projeto está selecionado.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const input: GenerateProgressReportInput = {
            projectName: validatedFields.data.projectName,
            tasksTodo: validatedFields.data.tasksTodo,
            tasksInProgress: validatedFields.data.tasksInProgress,
            tasksDone: validatedFields.data.tasksDone,
        };
        const result = await generateProgressReport(input);
        return { message: "Relatório de progresso gerado com sucesso.", data: result };
    } catch (error) {
        console.error(error);
        return { message: "Ocorreu um erro inesperado ao gerar o relatório." };
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


type SummarizePostState = {
    message: string;
    data?: SummarizePostOutput;
    error?: string;
};

export async function summarizePostAction(postContent: string): Promise<SummarizePostState> {
    if (!postContent || postContent.trim().length < 10) {
        return { message: "Content is too short to summarize.", error: "Content too short" };
    }
    try {
        const result = await summarizePost(postContent);
        return { message: "Summary loaded.", data: result };
    } catch(e) {
        console.error(e);
        return { message: "Failed to load summary.", error: "An unexpected error occurred."};
    }
}

type DescribeColaboradorState = {
    message: string;
    data?: DescribeColaboradorProfileOutput;
    error?: string;
};

export async function describeColaboradorAction(input: DescribeColaboradorProfileInput): Promise<DescribeColaboradorState> {
    const validatedFields = DescribeColaboradorProfileInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return {
            message: "Validation failed.",
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
        };
    }

    try {
        const result = await describeColaboradorProfile(validatedFields.data);
        return { message: "Profile described.", data: result };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { message: "Failed to describe profile.", error: errorMessage };
    }
}
