/**
 * @fileOverview Schemas and types for the summarizePost flow.
 *
 * - SummarizePostInputSchema - The Zod schema for the input.
 * - SummarizePostInput - The TypeScript type for the input.
 * - SummarizePostOutputSchema - The Zod schema for the output.
 * - SummarizePostOutput - The TypeScript type for the output.
 */
import { z } from 'zod';

export const SummarizePostInputSchema = z.string();
export type SummarizePostInput = z.infer<typeof SummarizePostInputSchema>;

export const SummarizePostOutputSchema = z.object({
  summary: z.string().describe('The concise summary of the post.'),
});
export type SummarizePostOutput = z.infer<typeof SummarizePostOutputSchema>;
