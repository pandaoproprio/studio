'use server';
/**
 * @fileOverview An AI flow to diagnose the relationship with a contact based on their interaction history.
 *
 * - diagnoseRelationship - A function that handles the relationship diagnosis process.
 */

import {ai} from '@/ai/genkit';
import {
    DiagnoseRelationshipInputSchema,
    DiagnoseRelationshipOutputSchema,
    type DiagnoseRelationshipInput,
    type DiagnoseRelationshipOutput,
} from '@/ai/schemas/diagnose-relationship-schemas';


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
