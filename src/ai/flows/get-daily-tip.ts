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
  prompt: `Você é um consultor especialista para organizações sociais e ONGs. Sua tarefa é fornecer uma única "Dica do Dia" que seja altamente acionável e concisa, em português do Brasil.

A dica deve focar em uma das seguintes áreas:
- Melhores práticas de Gestão de Projetos.
- Estratégias de captação de recursos (Fundraising).
- Engajamento comunitário e comunicação.
- Adoção de tecnologia e transformação digital.
- Bem-estar e produtividade da equipe.

A dica deve ser inspiradora, prática e curta o suficiente para ser lida rapidamente em um painel. Gere uma dica nova e única a cada vez.
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
    if (!output) {
      throw new Error('AI failed to generate a daily tip.');
    }
    return output;
  }
);

export async function getDailyTip(): Promise<DailyTipOutput> {
  return getDailyTipFlow();
}
