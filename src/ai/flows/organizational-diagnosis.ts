// src/ai/flows/organizational-diagnosis.ts
'use server';
/**
 * @fileOverview An AI flow to perform an organizational diagnosis.
 *
 * - organizationalDiagnosis - A function that returns a strategic diagnosis of the organization.
 */

import {ai} from '@/ai/genkit';
import {
    OrganizationalDiagnosisInputSchema,
    OrganizationalDiagnosisOutputSchema,
    type OrganizationalDiagnosisInput,
    type OrganizationalDiagnosisOutput
} from '@/ai/schemas/organizational-diagnosis-schemas';


export async function organizationalDiagnosis(input: OrganizationalDiagnosisInput): Promise<OrganizationalDiagnosisOutput> {
  return organizationalDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'organizationalDiagnosisPrompt',
  input: {schema: OrganizationalDiagnosisInputSchema},
  output: {schema: OrganizationalDiagnosisOutputSchema},
  prompt: `Você é um consultor de gestão sênior, especialista em diagnóstico organizacional para ONGs e organizações de impacto social. Sua tarefa é analisar as métricas fornecidas e produzir um diagnóstico estratégico claro e acionável.

  **Métricas da Organização:**

  **1. Saúde Financeira:**
     - Receita Anual: R$ {{{financials.annualRevenue}}}
     - Despesas Anuais: R$ {{{financials.annualExpenses}}}
     - Diversidade de Fontes de Renda (1-10): {{{financials.fundingDiversityScore}}}
     - Reserva de Emergência (meses): {{{financials.emergencyFundInMonths}}}

  **2. Sucesso de Projetos:**
     - Taxa de Sucesso dos Projetos (%): {{{projects.successRatePercentage}}}
     - Projetos dentro do Orçamento (%): {{{projects.onBudgetPercentage}}}
     - Satisfação dos Beneficiários (1-10): {{{projects.beneficiarySatisfactionScore}}}

  **3. Engajamento da Equipe:**
     - Taxa de Retenção de Funcionários (%): {{{team.employeeRetentionRatePercentage}}}
     - Satisfação da Equipe (1-10): {{{team.teamSatisfactionScore}}}

  **Sua Análise:**
  Com base nos dados acima, realize as seguintes tarefas:
  1.  **Pontuação Geral de Saúde:** Calcule uma pontuação geral de saúde para a organização, de 0 a 100. Considere todos os fatores, ponderando a saúde financeira e o sucesso dos projetos como os mais críticos.
  2.  **Análise por Área:** Avalie cada uma das três áreas (Financeiro, Projetos, Equipe), fornecendo uma pontuação de 0 a 100 para cada uma.
  3.  **Pontos Fortes:** Identifique de 2 a 3 pontos fortes principais da organização. Seja específico e use os dados para justificar.
  4.  **Pontos a Melhorar:** Identifique de 2 a 3 áreas principais que necessitam de atenção. Seja específico e use os dados para justificar.
  5.  **Recomendações Estratégicas:** Forneça de 2 a 3 recomendações claras, priorizadas e acionáveis para a liderança da organização. As recomendações devem abordar diretamente os pontos a melhorar.

  Retorne sua análise completa no formato JSON solicitado.
  `,
  config: {
    temperature: 0.6,
  }
});

const organizationalDiagnosisFlow = ai.defineFlow(
  {
    name: 'organizationalDiagnosisFlow',
    inputSchema: OrganizationalDiagnosisInputSchema,
    outputSchema: OrganizationalDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
