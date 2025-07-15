'use server';

/**
 * @fileOverview Generates a custom impact report using AI.
 *
 * - generateImpactReport - A function that generates an impact report.
 * - GenerateImpactReportInput - The input type for the generateImpactReport function.
 * - GenerateImpactReportOutput - The return type for the generateImpactReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImpactReportInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the project for which to generate an impact report.'),
  projectOutcomes: z.string().describe('A description of the project outcomes.'),
  desiredReportSections: z
    .string()
    .describe('A comma-separated list of report sections to include in the impact report.'),
});
export type GenerateImpactReportInput = z.infer<typeof GenerateImpactReportInputSchema>;

const GenerateImpactReportOutputSchema = z.object({
  report: z.string().describe('The generated impact report.'),
});
export type GenerateImpactReportOutput = z.infer<typeof GenerateImpactReportOutputSchema>;

export async function generateImpactReport(input: GenerateImpactReportInput): Promise<GenerateImpactReportOutput> {
  return generateImpactReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImpactReportPrompt',
  input: {schema: GenerateImpactReportInputSchema},
  output: {schema: GenerateImpactReportOutputSchema},
  prompt: `You are an AI assistant that generates impact reports for social organizations.

  Given the project description, project outcomes, and desired report sections, generate a comprehensive impact report.

  Project Description: {{{projectDescription}}}
  Project Outcomes: {{{projectOutcomes}}}
  Desired Report Sections: {{{desiredReportSections}}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateImpactReportFlow = ai.defineFlow(
  {
    name: 'generateImpactReportFlow',
    inputSchema: GenerateImpactReportInputSchema,
    outputSchema: GenerateImpactReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
