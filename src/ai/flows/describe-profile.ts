'use server';

/**
 * @fileOverview A flow that describes a collaborator's behavioral profile using AI.
 *
 * - describeColaboradorProfile - A function that returns the behavioral profile.
 * - DescribeColaboradorProfileInput - The input type for the function.
 * - DescribeColaboradorProfileOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DescribeColaboradorProfileInputSchema = z.object({
  role: z.string().describe('O cargo do colaborador.'),
  description: z.string().describe('Uma breve descrição sobre o colaborador ou suas responsabilidades.'),
});
export type DescribeColaboradorProfileInput = z.infer<typeof DescribeColaboradorProfileInputSchema>;

export const DescribeColaboradorProfileOutputSchema = z.object({
  profile: z.string().describe('A descrição do perfil comportamental gerada pela IA.'),
});
export type DescribeColaboradorProfileOutput = z.infer<typeof DescribeColaboradorProfileOutputSchema>;

export async function describeColaboradorProfile(input: DescribeColaboradorProfileInput): Promise<DescribeColaboradorProfileOutput> {
  return describeProfileFlow(input);
}

const describeProfilePrompt = ai.definePrompt({
  name: 'describeProfilePrompt',
  input: {schema: DescribeColaboradorProfileInputSchema},
  output: {schema: DescribeColaboradorProfileOutputSchema},
  prompt: `Você é um especialista em RH e psicologia organizacional. Sua tarefa é analisar o cargo e a descrição de um colaborador para traçar um perfil comportamental conciso e profissional. Destaque 3 a 5 características principais.

  Cargo: {{{role}}}
  Descrição: {{{description}}}

  Com base nisso, descreva o provável perfil comportamental deste colaborador.
  `,
  config: {
    temperature: 0.7,
  }
});

const describeProfileFlow = ai.defineFlow(
  {
    name: 'describeProfileFlow',
    inputSchema: DescribeColaboradorProfileInputSchema,
    outputSchema: DescribeColaboradorProfileOutputSchema,
  },
  async (input) => {
    const {output} = await describeProfilePrompt(input);
    return output!;
  }
);
