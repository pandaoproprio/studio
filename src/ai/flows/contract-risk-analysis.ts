'use server';
/**
 * @fileOverview An AI flow to analyze a contract for potential risks based on its status and end date.
 *
 * - analyzeContractRisk - A function that handles the contract risk analysis process.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzeContractRiskInputSchema,
    AnalyzeContractRiskOutputSchema,
    type AnalyzeContractRiskInput,
    type AnalyzeContractRiskOutput,
} from '@/ai/schemas/contract-risk-analysis-schemas';

export async function analyzeContractRisk(input: AnalyzeContractRiskInput): Promise<AnalyzeContractRiskOutput> {
  return analyzeContractRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContractRiskPrompt',
  input: {schema: AnalyzeContractRiskInputSchema},
  output: {schema: AnalyzeContractRiskOutputSchema},
  prompt: `Você é o "Guardião de Contratos", um assistente de IA especialista em gestão de riscos contratuais. Sua tarefa é analisar um contrato e identificar se ele representa um risco iminente para a organização.

  **Dados do Contrato:**
  - ID: {{{contractId}}}
  - Status: {{{status}}}
  - Data de Vencimento: {{{endDate}}}
  - Data de Hoje: ${new Date().toISOString().split('T')[0]}

  **Critérios de Análise de Risco:**
  1.  **Contratos Expirados:** Se o status for 'Expirado', o risco é ALTO. A ação sugerida deve ser verificar a necessidade de um novo contrato ou formalizar o encerramento.
  2.  **Contratos Próximos do Vencimento:** Se a 'Data de Vencimento' for em menos de 60 dias a partir da 'Data de Hoje', o risco é ALTO. A ação sugerida deve ser iniciar o processo de renovação ou negociação.
  3.  **Contratos Em Renovação:** Se o status for 'Em Renovação' e a 'Data de Vencimento' for em menos de 30 dias, o risco é MÉDIO/ALTO. A ação sugerida deve ser acelerar a negociação.
  4.  **Outros Casos:** Se nenhuma das condições acima for atendida, o contrato não é considerado um risco iminente.

  **Sua Missão:**
  - Defina 'isAtRisk' como 'true' se um risco for identificado, caso contrário, 'false'.
  - Forneça uma 'reason' clara e concisa para sua avaliação (Ex: "O contrato está expirado.", "Este contrato vence em menos de 60 dias.").
  - Proponha uma 'suggestedAction' clara e acionável (Ex: "Verificar a necessidade de um novo contrato.", "Iniciar processo de renovação imediatamente.").
  - Se não houver risco, retorne 'isAtRisk' como 'false' e mensagens apropriadas.
  `,
});

const analyzeContractRiskFlow = ai.defineFlow(
  {
    name: 'analyzeContractRiskFlow',
    inputSchema: AnalyzeContractRiskInputSchema,
    outputSchema: AnalyzeContractRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
