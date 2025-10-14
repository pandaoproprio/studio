/**
 * @fileOverview Schemas and types for the a3ProblemSolving flow.
 */
import { z } from 'zod';

export const A3ProblemSolvingInputSchema = z.object({
  background: z.string().min(20, "O contexto do problema deve ter pelo menos 20 caracteres."),
  currentState: z.string().min(20, "A descrição do estado atual deve ter pelo menos 20 caracteres."),
  goals: z.string().min(10, "Defina pelo menos um objetivo claro."),
});
export type A3ProblemSolvingInput = z.infer<typeof A3ProblemSolvingInputSchema>;

const ActionItemSchema = z.object({
    what: z.string().describe("A descrição da ação específica a ser tomada."),
    who: z.string().describe("O responsável pela execução da ação (ex: 'Equipe de Projetos')."),
    when: z.string().describe("O prazo para a conclusão da ação (ex: 'Próximo Sprint')."),
    resources: z.string().describe("Os recursos necessários para a ação."),
});

const FollowUpSchema = z.object({
    expectedResults: z.string().describe("Os resultados positivos esperados após a implementação."),
    kpis: z.array(z.string()).describe("As métricas de sucesso (KPIs) para medir o progresso."),
    monitoringMethod: z.string().describe("Como o progresso será acompanhado."),
});

export const A3ProblemSolvingOutputSchema = z.object({
    rootCauseAnalysis: z.array(z.string()).describe("A análise de causa raiz usando a técnica dos 5 Porquês."),
    actionPlan: z.array(ActionItemSchema).describe("O plano de ação detalhado com o quê, quem, quando e recursos."),
    followUp: FollowUpSchema.describe("O plano de acompanhamento com resultados esperados, KPIs e método de monitoramento."),
});
export type A3ProblemSolvingOutput = z.infer<typeof A3ProblemSolvingOutputSchema>;
