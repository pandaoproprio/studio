'use server';
/**
 * @fileOverview An AI flow to generate a narrative summary based on project and financial data.
 *
 * - generateNarrativeSummary - A function that generates a structured narrative summary.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateNarrativeSummaryInputSchema,
    GenerateNarrativeSummaryOutputSchema,
    type GenerateNarrativeSummaryInput,
    type GenerateNarrativeSummaryOutput
} from '@/ai/schemas/generate-narrative-summary-schemas';

export async function generateNarrativeSummary(input: GenerateNarrativeSummaryInput): Promise<GenerateNarrativeSummaryOutput> {
  return generateNarrativeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNarrativeSummaryPrompt',
  input: {schema: GenerateNarrativeSummaryInputSchema},
  output: {schema: GenerateNarrativeSummaryOutputSchema},
  prompt: `Você é um analista de Business Intelligence e gerente de projetos sênior. Sua tarefa é analisar dados de diferentes fontes (projetos, finanças, RH) e gerar um resumo narrativo coeso e inteligente para um relatório semanal.

  **Dados da Semana:**

  **1. Tarefas Concluídas (do Quadro Kanban):**
  {{#if tasks}}
    {{#each tasks}}
    - **Projeto:** {{this.projectName}} | **Tarefa:** {{this.taskName}}
    {{/each}}
  {{else}}
    - Nenhuma tarefa concluída esta semana.
  {{/if}}

  **2. Transações Financeiras Relevantes:**
  {{#if transactions}}
    {{#each transactions}}
    - **Projeto:** {{this.projectName}} | **Descrição:** {{this.description}} | **Valor:** R$ {{this.amount}} ({{this.type}})
    {{/each}}
  {{else}}
    - Nenhuma transação financeira relevante registrada.
  {{/if}}

  **Sua Missão:**
  Com base nos dados acima, gere um **resumo narrativo** e **pontos de atenção**.

  1.  **Resumo Narrativo:**
      - Escreva um parágrafo conciso que resuma as principais atividades da semana. Conecte as tarefas concluídas com as transações financeiras, se possível. Ex: "A semana foi marcada pelo avanço no Projeto Social, com a conclusão da etapa de 'Criação da Campanha', que teve um gasto associado de R$ 850,00 em materiais gráficos."

  2.  **Pontos de Atenção:**
      - Identifique de 1 a 3 pontos que merecem atenção da gestão. Podem ser projetos com muitas despesas, falta de progresso em alguma área, ou a conclusão de marcos importantes que destravam próximas etapas. Seja estratégico e proativo em suas observações.

  Seja objetivo, analítico e forneça insights que um gestor ocupado possa usar para tomar decisões. Retorne sua análise no formato JSON solicitado.`,
  config: {
    temperature: 0.6,
  }
});

const generateNarrativeSummaryFlow = ai.defineFlow(
  {
    name: 'generateNarrativeSummaryFlow',
    inputSchema: GenerateNarrativeSummaryInputSchema,
    outputSchema: GenerateNarrativeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
     if (!output) {
      throw new Error('AI failed to generate a narrative summary.');
    }
    return output;
  }
);
