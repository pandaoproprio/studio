/**
 * @fileOverview Schemas and types for the corporateRiskAnalysis flow.
 */
import { z } from 'zod';

export const CorporateRiskAnalysisInputSchema = z.object({
  initiativeDescription: z.string().min(10, "A descrição da iniciativa deve ter pelo menos 10 caracteres."),
  context: z.string().min(20, "O contexto deve ter pelo menos 20 caracteres."),
});
export type CorporateRiskAnalysisInput = z.infer<typeof CorporateRiskAnalysisInputSchema>;

export const CorporateRiskAnalysisOutputSchema = z.object({
    overallRiskScore: z.number().describe("A pontuação geral de risco da iniciativa (0-100)."),
    overallRiskLevel: z.string().describe("O nível de risco geral (Baixo, Médio, Alto, Muito Alto)."),
    financialRisks: z.array(z.string()).describe("Uma lista de riscos financeiros identificados."),
    operationalRisks: z.array(z.string()).describe("Uma lista de riscos operacionais identificados."),
    reputationalRisks: z.array(z.string()).describe("Uma lista de riscos de reputação identificados."),
    mitigationPlan: z.array(z.string()).describe("Uma lista de ações recomendadas para mitigar os riscos."),
});
export type CorporateRiskAnalysisOutput = z.infer<typeof CorporateRiskAnalysisOutputSchema>;
