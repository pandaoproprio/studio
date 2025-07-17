// src/ai/schemas/organizational-diagnosis-schemas.ts
/**
 * @fileOverview Schemas and types for the organizationalDiagnosis flow.
 */
import { z } from 'zod';

export const OrganizationalDiagnosisInputSchema = z.object({
  financials: z.object({
    annualRevenue: z.number().min(0, "Receita anual deve ser positiva."),
    annualExpenses: z.number().min(0, "Despesas anuais devem ser positivas."),
    fundingDiversityScore: z.number().min(1).max(10, "Pontuação deve ser entre 1 e 10."),
    emergencyFundInMonths: z.number().min(0, "Reserva deve ser 0 ou mais."),
  }),
  projects: z.object({
    successRatePercentage: z.number().min(0).max(100, "Taxa de sucesso deve ser entre 0 e 100."),
    onBudgetPercentage: z.number().min(0).max(100, "Percentual de orçamento deve ser entre 0 e 100."),
    beneficiarySatisfactionScore: z.number().min(1).max(10, "Pontuação deve ser entre 1 e 10."),
  }),
  team: z.object({
    employeeRetentionRatePercentage: z.number().min(0).max(100, "Taxa de retenção deve ser entre 0 e 100."),
    teamSatisfactionScore: z.number().min(1).max(10, "Pontuação deve ser entre 1 e 10."),
  })
});
export type OrganizationalDiagnosisInput = z.infer<typeof OrganizationalDiagnosisInputSchema>;

export const OrganizationalDiagnosisOutputSchema = z.object({
    overallHealthScore: z.number().describe("A pontuação geral de saúde da organização (0-100)."),
    scoresByArea: z.array(z.object({
        area: z.string().describe("A área analisada (ex: Financeiro, Projetos, Equipe)."),
        score: z.number().describe("A pontuação para essa área (0-100).")
    })).describe("Uma lista de pontuações para cada área principal da organização."),
    strengths: z.array(z.string()).describe("Uma lista dos principais pontos fortes identificados."),
    weaknesses: z.array(z.string()).describe("Uma lista das principais áreas a serem melhoradas."),
    recommendations: z.array(z.string()).describe("Uma lista de recomendações estratégicas acionáveis."),
});
export type OrganizationalDiagnosisOutput = z.infer<typeof OrganizationalDiagnosisOutputSchema>;
