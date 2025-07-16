'use server';

/**
 * @fileOverview An AI flow to analyze a project task for potential risks.
 *
 * - analyzeTaskRisk - A function that handles the task risk analysis process.
 * - AnalyzeTaskRiskInput - The input type for the analyzeTaskRisk function.
 * - AnalyzeTaskRiskOutput - The return type for the analyzeTaskRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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


export async function analyzeTaskRisk(input: AnalyzeTaskRiskInput): Promise<AnalyzeTaskRiskOutput> {
  return analyzeTaskRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTaskRiskPrompt',
  input: {schema: AnalyzeTaskRiskInputSchema},
  output: {schema: AnalyzeTaskRiskOutputSchema},
  prompt: `You are a senior project manager AI, acting as the "Project Guardian". Your task is to analyze a single project task and determine if it represents a significant risk to the project's timeline or success.

  Task Information:
  - Title: {{{taskTitle}}}
  - Description: {{{taskDescription}}}
  - Priority: {{{taskPriority}}}
  - Days in Current Status: {{{daysInCurrentStatus}}}

  Analysis Criteria:
  1.  A task is considered a high risk if it has "high" or "urgent" priority and has been in the same status for more than 5 days.
  2.  A task with "medium" priority is a moderate risk if it's been in the same status for more than 10 days.
  3.  Tasks with "low" priority are generally not a risk unless they have been stagnant for over 20 days.
  4.  Consider the description. If it mentions blockers, dependencies, or external factors, the risk level increases.

  Based on this, set 'isAtRisk' to true or false and provide a clear, concise 'reason' for your assessment. Also, provide a confidence score for your analysis.
  `,
  config: {
    temperature: 0.3,
  }
});

const analyzeTaskRiskFlow = ai.defineFlow(
  {
    name: 'analyzeTaskRiskFlow',
    inputSchema: AnalyzeTaskRiskInputSchema,
    outputSchema: AnalyzeTaskRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
