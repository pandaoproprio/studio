'use server';

/**
 * @fileOverview An AI flow to analyze a project task for potential risks.
 *
 * - analyzeTaskRisk - A function that handles the task risk analysis process.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzeTaskRiskInputSchema,
    AnalyzeTaskRiskOutputSchema,
    type AnalyzeTaskRiskInput,
    type AnalyzeTaskRiskOutput,
} from '@/ai/schemas/project-risk-analysis-schemas';

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
