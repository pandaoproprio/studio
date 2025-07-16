/**
 * @fileOverview Schemas and types for the describeColaboradorProfile flow.
 */
import { z } from 'zod';

export const DescribeColaboradorProfileInputSchema = z.object({
  role: z.string().describe('O cargo do colaborador.'),
  description: z.string().describe('Uma breve descrição sobre o colaborador ou suas responsabilidades.'),
});
export type DescribeColaboradorProfileInput = z.infer<typeof DescribeColaboradorProfileInputSchema>;

export const DescribeColaboradorProfileOutputSchema = z.object({
  profile: z.string().describe('A descrição do perfil comportamental gerada pela IA.'),
});
export type DescribeColaboradorProfileOutput = z.infer<typeof DescribeColaboradorProfileOutputSchema>;
