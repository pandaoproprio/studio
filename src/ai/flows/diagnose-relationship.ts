// src/ai/flows/diagnose-relationship.ts
'use server';
/**
 * @fileOverview An AI flow to diagnose the relationship with a contact based on their interaction history.
 *
 * - diagnoseRelationship - A function that handles the relationship diagnosis process.
 * - DiagnoseRelationshipInput - The input type for the diagnoseRelationship function.
 * - DiagnoseRelationshipOutput - The return type for the diagnoseRelationship function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const InteractionSchema = z.object({
  type: z.string(),
  date: z.string(),
  notes: z.string(),
});

export const DiagnoseRelationshipInputSchema = z.object({
  contactName: z.string().describe("The name of the contact."),
  interactions: z.array(InteractionSchema).describe("The history of interactions with the contact."),
});
export type DiagnoseRelationshipInput = z.infer<typeof DiagnoseRelationshipInputSchema>;

export const DiagnoseRelationshipOutputSchema = z.object({
  engagementLevel: z.string().describe("The assessed engagement level of the contact (e.g., Alto, Médio, Baixo)."),
  overallSentiment: z.string().describe("The overall sentiment of the relationship (e.g., Positivo, Neutro, Negativo)."),
  nextActionSuggestion: z.string().describe("A concrete suggestion for the next action to take with this contact."),
});
export type DiagnoseRelationshipOutput = z.infer<typeof DiagnoseRelationshipOutputSchema>;

export async function diagnoseRelationship(input: DiagnoseRelationshipInput): Promise<DiagnoseRelationshipOutput> {
  return diagnoseRelationshipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseRelationshipPrompt',
  input: {schema: DiagnoseRelationshipInputSchema},
  output: {schema: DiagnoseRelationshipOutputSchema},
  prompt: `Você é um especialista em CRM e análise de relacionamento. Sua tarefa é analisar o histórico de interações com um contato e fornecer um diagnóstico conciso e estratégico.

  **Contato:** {{{contactName}}}

  **Histórico de Interações:**
  {{#if interactions}}
  {{#each interactions}}
  - **Data:** {{this.date}}
    **Tipo:** {{this.type}}
    **Anotações:** {{this.notes}}
  {{/each}}
  {{else}}
  - Nenhuma interação registrada.
  {{/if}}

  **Sua Análise:**
  Com base no histórico, avalie o seguinte:
  1.  **Nível de Engajamento:** Classifique como Alto, Médio ou Baixo. Leve em conta a frequência, a proatividade e a qualidade das interações.
  2.  **Sentimento Geral:** Descreva o sentimento predominante (Positivo, Neutro, Negativo, Colaborativo, etc.).
  3.  **Sugestão de Próxima Ação:** Forneça uma recomendação clara e acionável para o próximo passo a ser dado com este contato para fortalecer o relacionamento ou atingir um objetivo.

  Retorne sua análise no formato JSON solicitado. Se não houver interações, baseie sua análise nesse fato (engajamento baixo, etc.).`,
  config: {
    temperature: 0.5,
  }
});

const diagnoseRelationshipFlow = ai.defineFlow(
  {
    name: 'diagnoseRelationshipFlow',
    inputSchema: DiagnoseRelationshipInputSchema,
    outputSchema: DiagnoseRelationshipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
