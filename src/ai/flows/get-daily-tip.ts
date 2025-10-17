'use server';
/**
 * @fileOverview A flow that returns a daily tip for NGO management.
 *
 * - getDailyTip - A function that returns a daily tip.
 * - DailyTipOutput - The return type for the getDailyTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DailyTipOutputSchema = z.object({
  tip: z.string().describe('The daily tip for the user.'),
});
export type DailyTipOutput = z.infer<typeof DailyTipOutputSchema>;

export async function getDailyTip(): Promise<DailyTipOutput> {
  return getDailyTipFlow();
}

const getDailyTipPrompt = ai.definePrompt({
  name: 'getDailyTipPrompt',
  output: {schema: DailyTipOutputSchema},
  prompt: `Você é um consultor especialista em gestão de ONGs e organizações do terceiro setor.

Sua tarefa é fornecer uma dica do dia (tip of the day) que seja curta, prática e inspiradora para um gestor de uma organização social.

A dica deve ser acionável e relevante para os desafios comuns enfrentados por essas organizações, como captação de recursos, engajamento de voluntários, gestão de projetos, comunicação de impacto, etc.

Seja criativo e forneça uma dica nova a cada vez.

Exemplos de dicas:
- "Revise hoje o texto da sua principal página de doação. Uma linguagem mais clara e um call-to-action forte podem aumentar as conversões em até 15%."
- "Grave um vídeo de 1 minuto com seu celular agradecendo um doador ou voluntário específico. O reconhecimento pessoal fortalece laços e incentiva o apoio contínuo."
- "Dedique 30 minutos para analisar os dados do seu principal projeto. Identificar uma métrica que está performando bem pode revelar uma história de sucesso para compartilhar com seus apoiadores."
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
    const {output} = await getDailyTipPrompt();
    if (!output) {
      throw new Error('AI failed to generate a daily tip.');
    }
    return output;
  }
);
