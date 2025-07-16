// src/ai/flows/summarize-post.ts
'use server';

/**
 * @fileOverview A flow that summarizes a post.
 *
 * - summarizePost - A function that returns the summary of a post.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizePostInputSchema,
  SummarizePostOutputSchema,
  type SummarizePostInput,
  type SummarizePostOutput
} from '@/ai/schemas/summarize-post-schemas';

export async function summarizePost(postContent: SummarizePostInput): Promise<SummarizePostOutput> {
  return summarizePostFlow(postContent);
}

const summarizePostPrompt = ai.definePrompt({
  name: 'summarizePostPrompt',
  input: {schema: SummarizePostInputSchema},
  output: {schema: SummarizePostOutputSchema},
  prompt: `You are an expert in communication and synthesis. Your task is to summarize the following text to be clear, concise, and impactful for an internal announcement feed. Keep the summary to a maximum of 2 sentences.

  Original text:
  "{{prompt}}"
  `,
  config: {
    temperature: 0.5,
  }
});

const summarizePostFlow = ai.defineFlow(
  {
    name: 'summarizePostFlow',
    inputSchema: SummarizePostInputSchema,
    outputSchema: SummarizePostOutputSchema,
  },
  async (prompt) => {
    const {output} = await summarizePostPrompt(prompt);
    return output!;
  }
);
