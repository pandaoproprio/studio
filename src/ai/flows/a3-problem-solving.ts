'use server';
/**
 * @fileOverview An AI flow to assist with A3 problem-solving methodology.
 *
 * - a3ProblemSolving - A function that generates a structured A3 report.
 */

import {ai} from '@/ai/genkit';
import {
    A3ProblemSolvingInputSchema,
    A3ProblemSolvingOutputSchema,
    type A3ProblemSolvingInput,
    type A3ProblemSolvingOutput
} from '@/ai/schemas/a3-problem-solving-schemas';

export async function a3ProblemSolving(input: A3ProblemSolvingInput): Promise<A3ProblemSolvingOutput> {
  return a3ProblemSolvingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'a3ProblemSolvingPrompt',
  input: {schema: A3ProblemSolvingInputSchema},
  output: {schema: A3ProblemSolvingOutputSchema},
  prompt: `Você é um especialista em Lean Manufacturing e na metodologia de resolução de problemas A3, adaptada para o contexto de organizações sociais. Sua tarefa é ajudar um usuário a estruturar um relatório A3 para um problema específico.

  **Contexto do Problema Fornecido pelo Usuário:**
  - **Fundo/Contexto:** {{{background}}}
  - **Estado Atual:** {{{currentState}}}
  - **Objetivos/Metas:** {{{goals}}}

  **Sua Missão:**
  Com base nas informações fornecidas, gere as seções restantes do relatório A3 no formato JSON solicitado:

  1.  **Análise de Causa Raiz:**
      - Utilize a técnica dos "5 Porquês" para investigar a fundo o problema.
      - Apresente uma análise clara que identifique as causas fundamentais, não apenas os sintomas.
      - Liste pelo menos 3 a 5 "porquês" em sequência lógica.

  2.  **Plano de Ação:**
      - Proponha de 3 a 5 ações corretivas claras, específicas e acionáveis que abordem diretamente as causas raiz identificadas.
      - Para cada ação, defina: 'o quê' (a ação em si), 'quem' (um responsável genérico, ex: "Equipe de Projetos", "Liderança"), 'quando' (um prazo realista, ex: "Próximo Sprint", "30 dias"), e 'recursos' necessários (ex: "Sessão de brainstorm", "Ajuste no fluxo do Scrumban").

  3.  **Resultados Esperados e Acompanhamento:**
      - Descreva os resultados positivos esperados após a implementação do plano de ação.
      - Defina 2 a 3 métricas de sucesso (KPIs) claras que serão usadas para medir se os objetivos foram alcançados.
      - Sugira um método de acompanhamento (ex: "Revisão semanal na Daily Scrum", "Ponto de verificação quinzenal").

  Seja objetivo, estruturado e forneça um plano prático que a equipe possa usar para resolver o problema de forma eficaz.`,
  config: {
    temperature: 0.6,
  }
});

const a3ProblemSolvingFlow = ai.defineFlow(
  {
    name: 'a3ProblemSolvingFlow',
    inputSchema: A3ProblemSolvingInputSchema,
    outputSchema: A3ProblemSolvingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
