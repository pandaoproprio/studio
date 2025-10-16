/**
 * @fileOverview Schemas and types for the analyzeContractRisk flow.
 */
import { z } from 'zod';

export const AnalyzeContractRiskInputSchema = z.object({
  contractId: z.string().describe("The ID of the contract."),
  status: z.string().describe("The current status of the contract (e.g., 'Ativo', 'Expirado')."),
  endDate: z.string().describe("The end date of the contract in YYYY-MM-DD format."),
});
export type AnalyzeContractRiskInput = z.infer<typeof AnalyzeContractRiskInputSchema>;


export const AnalyzeContractRiskOutputSchema = z.object({
    isAtRisk: z.boolean().describe("Whether the contract is considered to be at risk."),
    reason: z.string().describe("A concise explanation of why the contract is at risk."),
    suggestedAction: z.string().describe("A clear, actionable suggestion for the next step."),
});
export type AnalyzeContractRiskOutput = z.infer<typeof AnalyzeContractRiskOutputSchema>;
