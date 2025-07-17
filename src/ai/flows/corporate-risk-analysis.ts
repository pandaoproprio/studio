'use server';
/**
 * @fileOverview An AI flow to perform a corporate risk analysis on a new initiative.
 *
 * - corporateRiskAnalysis - A function that returns a strategic risk analysis.
 */

import {ai} from '@/ai/genkit';
import {
    CorporateRiskAnalysisInputSchema,
    CorporateRiskAnalysisOutputSchema,
    type CorporateRiskAnalysisInput,
    type CorporateRiskAnalysisOutput
} from '@/ai/schemas/corporate-risk-analysis-schemas';

export async function corporateRiskAnalysis(input: CorporateRiskAnalysisInput): Promise<CorporateRiskAnalysisOutput> {
  return corporateRiskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'corporateRiskAnalysisPrompt',
  input: {schema: CorporateRiskAnalysisInputSchema},
  output: {schema: CorporateRiskAnalysisOutputSchema},
  prompt: `Você é um consultor sênior de gestão de riscos corporativos. Sua tarefa é analisar uma nova iniciativa proposta por uma organização e fornecer um diagnóstico de risco claro, estruturado e acionável.

  **Iniciativa Proposta:** {{{initiativeDescription}}}
  **Contexto Adicional:** {{{context}}}

  **Sua Análise:**
  Com base nas informações fornecidas, realize as seguintes tarefas:

  1.  **Análise de Riscos Financeiros:** Identifique de 2 a 3 riscos financeiros potenciais. Considere custos inesperados, impacto no fluxo de caixa, retorno sobre o investimento (ROI) incerto, e dependência de financiamento.

  2.  **Análise de Riscos Operacionais:** Identifique de 2 a 3 riscos operacionais. Pense em complexidade de implementação, necessidade de novas competências, impacto na equipe atual, dependência de terceiros e riscos tecnológicos.

  3.  **Análise de Riscos de Reputação:** Identifique de 1 a 2 riscos de reputação. Considere o impacto na imagem da marca, a reação de stakeholders (doadores, beneficiários, comunidade) e possíveis crises de comunicação.

  4.  **Nível de Risco Geral:** Com base nos riscos identificados, atribua um nível de risco geral para a iniciativa (Baixo, Médio, Alto, Muito Alto).

  5.  **Pontuação de Risco Geral:** Calcule uma pontuação de risco geral de 0 a 100, onde 100 é o risco máximo. Seja criterioso e justifique a pontuação implicitamente com base na severidade dos riscos listados.

  6.  **Plano de Mitigação:** Para os riscos mais críticos identificados, sugira de 2 a 3 ações claras e práticas que a organização pode tomar para mitigar ou monitorar esses riscos.

  Seja realista e profissional. O objetivo é ajudar a liderança a tomar uma decisão informada, não desencorajar a inovação. Retorne sua análise completa no formato JSON solicitado.`,
  config: {
    temperature: 0.6,
  }
});

const corporateRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'corporateRiskAnalysisFlow',
    inputSchema: CorporateRiskAnalysisInputSchema,
    outputSchema: CorporateRiskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);