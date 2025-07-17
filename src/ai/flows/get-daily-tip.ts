// src/ai/flows/get-daily-tip.ts
'use server';
/**
 * @fileOverview An AI flow to generate a daily productivity tip for NGO managers.
 *
 * - getDailyTip - A function that returns a daily tip.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DailyTipOutputSchema = z.object({
  tip: z.string().describe('The actionable, concise tip for the user.'),
});
export type DailyTipOutput = z.infer<typeof DailyTipOutputSchema>;

const prompt = ai.definePrompt({
  name: 'dailyTipPrompt',
  output: {schema: DailyTipOutputSchema},
  prompt: `You are an expert consultant for social organizations and NGOs. Your task is to provide a single, highly actionable, and concise "Tip of the Day".

The tip should focus on one of the following areas:
- Project Management best practices.
- Fundraising strategies.
- Community engagement and communication.
- Technology adoption and digital transformation.
- Team well-being and productivity.

The tip must be inspiring, practical, and short enough to be read quickly on a dashboard. Generate a new, unique tip each time.
`,
  config: {
    temperature: 0.9,
  },
});

const getDailyTipFlow = ai.defineFlow(
  {
    name: 'getDailyTipFlow',
    outputSchema: DailyTipOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);

export async function getDailyTip(): Promise<DailyTipOutput> {
  return getDailyTipFlow();
}
