/**
 * @fileOverview Schemas and types for the analyzeTaskRisk flow.
 */
import { z } from 'zod';

export const AnalyzeTaskRiskInputSchema = z.object({
  taskTitle: z.string().describe("The title of the task."),
  taskDescription: z.string().describe("The description of the task."),
  taskPriority: z.string().describe("The priority of the task (e.g., high, medium, low)."),
  daysInCurrentStatus: z.number().describe("The number of days the task has been in its current status."),
});
export type AnalyzeTaskRiskInput = z.infer<typeof AnalyzeTaskRiskInputSchema>;


export const AnalyzeTaskRiskOutputSchema = z.object({
    isAtRisk: z.boolean().describe("Whether the task is considered at risk of causing delays or problems."),
    reason: z.string().describe("A concise explanation of why the task is or is not at risk. Explain the logic."),
    confidenceScore: z.number().min(0).max(1).describe("A score from 0 to 1 indicating the confidence in the risk assessment."),
});
export type AnalyzeTaskRiskOutput = z.infer<typeof AnalyzeTaskRiskOutputSchema>;
