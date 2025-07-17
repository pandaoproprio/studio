// @/lib/actions.ts
"use server";

import {
  generateImpactReport,
  GenerateImpactReportInput,
  GenerateImpactReportOutput,
} from "@/ai/flows/generate-impact-report";
import {
  generateProgressReport,
  type GenerateProgressReportInput,
  type GenerateProgressReportOutput,
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
  type DescribeColaboradorProfileInput,
  type DescribeColaboradorProfileOutput
} from "@/ai/flows/describe-profile";
import { DescribeColaboradorProfileInputSchema } from "@/ai/schemas/describe-profile-schemas";
import { 
    generateVideoStory,
} from "@/ai/flows/generate-video-story";
import { type GenerateVideoStoryOutput } from "@/ai/schemas/generate-video-story-schemas";
import {
    diagnoseRelationship,
    type DiagnoseRelationshipInput,
    type DiagnoseRelationshipOutput,
} from "@/ai/flows/diagnose-relationship";
import { DiagnoseRelationshipInputSchema } from "@/ai/schemas/diagnose-relationship-schemas";
import {
    analyzeTaskRisk,
    type AnalyzeTaskRiskInput,
    type AnalyzeTaskRiskOutput,
} from "@/ai/flows/project-risk-analysis";
import { AnalyzeTaskRiskInputSchema } from "@/ai/schemas/project-risk-analysis-schemas";
import { getDailyTip, type DailyTipOutput } from "@/ai/flows/get-daily-tip";
import {
    organizationalDiagnosis,
    type OrganizationalDiagnosisOutput,
} from "@/ai/flows/organizational-diagnosis";
import { OrganizationalDiagnosisInputSchema } from "@/ai/schemas/organizational-diagnosis-schemas";
import {
    corporateRiskAnalysis,
    type CorporateRiskAnalysisOutput
} from "@/ai/flows/corporate-risk-analysis";
import { CorporateRiskAnalysisInputSchema } from "@/ai/schemas/corporate-risk-analysis-schemas";

import { z } from "zod";

const impactReportSchema = z.object({
  projectDescription: z.string().min(20, "A descrição do projeto deve ter pelo menos 20 caracteres."),
  projectOutcomes: z.string().min(20, "Os resultados do projeto devem ter pelo menos 20 caracteres."),
  desiredReportSections: z.string().min(5, "Forneça pelo menos uma seção desejada para o relatório."),
});

type ImpactReportState = {
  message: string;
  data?: GenerateImpactReportOutput | null;
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
      message: "A validação falhou. Verifique os campos.",
      data: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateImpactReport(validatedFields.data);
    return { message: "Relatório gerado com sucesso.", data: result, errors: {} };
  } catch (error) {
    console.error(error);
    return { message: "Ocorreu um erro inesperado ao gerar o relatório.", data: null };
  }
}

const progressReportSchema = z.object({
    projectId: z.string().min(1, "Por favor, selecione um projeto."),
    projectName: z.string(),
    tasksTodo: z.string().transform(val => JSON.parse(val) as string[]),
    tasksInProgress: z.string().transform(val => JSON.parse(val) as string[]),
    tasksDone: z.string().transform(val => JSON.parse(val) as string[]),
    targetAudience: z.string(),
    tone: z.string(),
    additionalContext: z.string().optional(),
});

type ProgressReportState = {
    message: string;
    data?: GenerateProgressReportOutput | null;
    errors?: {
        projectId?: string[];
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
        targetAudience: formData.get("targetAudience"),
        tone: formData.get("tone"),
        additionalContext: formData.get("additionalContext"),
    };

    if (!rawData.projectName || !rawData.projectId) {
         return {
            message: "Por favor, selecione um projeto para carregar os dados.",
            data: null,
            errors: { projectId: ["Selecione um projeto válido."] }
         }
    }

    const validatedFields = progressReportSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
        return {
            message: "Falha na validação. Certifique-se de que um projeto está selecionado.",
            data: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const input: GenerateProgressReportInput = {
            ...validatedFields.data,
            additionalContext: validatedFields.data.additionalContext || "",
        };
        const result = await generateProgressReport(input);
        const processedReport = result.report.replace(/```html\n?|```/g, '');
        return { message: "Relatório de progresso gerado com sucesso.", data: { report: processedReport } };
    } catch (error) {
        console.error(error);
        return { message: "Ocorreu um erro inesperado ao gerar o relatório.", data: null };
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
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { message: "Failed to load summary.", error: errorMessage};
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


type GenerateVideoStoryState = {
    message: string;
    data?: GenerateVideoStoryOutput;
    error?: string;
};

export async function generateVideoStoryAction(text: string): Promise<GenerateVideoStoryState> {
    if (!text || text.trim().length < 20) {
        return { message: "Text is too short for a video story.", error: "Text too short" };
    }

    try {
        const result = await generateVideoStory(text);
        return { message: "Video generated", data: result };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { message: "Failed to generate video.", error: errorMessage};
    }
}


type DiagnoseRelationshipState = {
    message: string;
    data?: DiagnoseRelationshipOutput;
    error?: string;
};

export async function diagnoseRelationshipAction(input: DiagnoseRelationshipInput): Promise<DiagnoseRelationshipState> {
    const validatedFields = DiagnoseRelationshipInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return {
            message: "Validation failed.",
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
        };
    }

    try {
        const result = await diagnoseRelationship(validatedFields.data);
        return { message: "Diagnosis complete.", data: result };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { message: "Failed to generate diagnosis.", error: errorMessage };
    }
}

type ProjectRiskAnalysisState = {
    message: string;
    data?: AnalyzeTaskRiskOutput;
    error?: string;
};

export async function projectRiskAnalysisAction(input: AnalyzeTaskRiskInput): Promise<ProjectRiskAnalysisState> {
    const validatedFields = AnalyzeTaskRiskInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return {
            message: "Validation failed.",
            error: "Invalid input data provided for risk analysis.",
        };
    }

    try {
        const result = await analyzeTaskRisk(validatedFields.data);
        return { message: "Risk analysis complete.", data: result };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during risk analysis.";
        return { message: "Failed to analyze risk.", error: errorMessage };
    }
}

type DailyTipState = {
    message: string;
    data?: DailyTipOutput;
    error?: string;
};

export async function getDailyTipAction(): Promise<DailyTipState> {
    try {
        const result = await getDailyTip();
        return { message: "Tip loaded.", data: result };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { message: "Failed to load tip.", error: errorMessage};
    }
}

type OrganizationalDiagnosisState = {
    message: string;
    data?: OrganizationalDiagnosisOutput | null;
    errors?: any;
  };

export async function organizationalDiagnosisAction(
    prevState: OrganizationalDiagnosisState,
    formData: FormData
): Promise<OrganizationalDiagnosisState> {
    const rawData = {
        financials: {
            annualRevenue: Number(formData.get("financials.annualRevenue")),
            annualExpenses: Number(formData.get("financials.annualExpenses")),
            fundingDiversityScore: Number(formData.get("financials.fundingDiversityScore")),
            emergencyFundInMonths: Number(formData.get("financials.emergencyFundInMonths")),
        },
        projects: {
            successRatePercentage: Number(formData.get("projects.successRatePercentage")),
            onBudgetPercentage: 70, // Hardcoded for now as it's not in the form
            beneficiarySatisfactionScore: Number(formData.get("projects.beneficiarySatisfactionScore")),
        },
        team: {
            employeeRetentionRatePercentage: Number(formData.get("team.employeeRetentionRatePercentage")),
            teamSatisfactionScore: Number(formData.get("team.teamSatisfactionScore")),
        }
    };

    const validatedFields = OrganizationalDiagnosisInputSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            message: "A validação falhou. Verifique os campos.",
            data: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await organizationalDiagnosis(validatedFields.data);
        return { message: "Diagnóstico gerado com sucesso.", data: result, errors: {} };
    } catch (error) {
        console.error(error);
        return { message: "Ocorreu um erro inesperado ao gerar o diagnóstico.", data: null };
    }
}

type CorporateRiskAnalysisState = {
    message: string;
    data?: CorporateRiskAnalysisOutput | null;
    errors?: any;
};

export async function corporateRiskAnalysisAction(
    prevState: CorporateRiskAnalysisState,
    formData: FormData
): Promise<CorporateRiskAnalysisState> {
    const validatedFields = CorporateRiskAnalysisInputSchema.safeParse({
        initiativeDescription: formData.get("initiativeDescription"),
        context: formData.get("context"),
    });

    if (!validatedFields.success) {
        return {
            message: "A validação falhou. Verifique os campos.",
            data: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await corporateRiskAnalysis(validatedFields.data);
        return { message: "Análise de risco gerada com sucesso.", data: result, errors: {} };
    } catch (error) {
        console.error(error);
        return { message: "Ocorreu um erro inesperado ao gerar a análise de risco.", data: null };
    }
}