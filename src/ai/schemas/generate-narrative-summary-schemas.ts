/**
 * @fileOverview Schemas and types for the generateNarrativeSummary flow.
 */
import { z } from 'zod';

const TaskDataSchema = z.object({
    projectName: z.string().describe("O nome do projeto ao qual a tarefa pertence."),
    taskName: z.string().describe("O nome da tarefa concluída."),
});

const TransactionDataSchema = z.object({
    projectName: z.string().describe("O nome do projeto associado à transação."),
    description: z.string().describe("A descrição da transação financeira."),
    amount: z.number().describe("O valor da transação."),
    type: z.enum(['Receita', 'Despesa']).describe("O tipo da transação."),
});

export const GenerateNarrativeSummaryInputSchema = z.object({
  tasks: z.array(TaskDataSchema).describe("Uma lista de tarefas concluídas na semana."),
  transactions: z.array(TransactionDataSchema).describe("Uma lista de transações financeiras relevantes da semana."),
});
export type GenerateNarrativeSummaryInput = z.infer<typeof GenerateNarrativeSummaryInputSchema>;


export const GenerateNarrativeSummaryOutputSchema = z.object({
    narrativeSummary: z.string().describe("Um parágrafo que resume as atividades da semana, conectando dados de projetos e finanças."),
    attentionPoints: z.array(z.string()).describe("Uma lista de 1 a 3 pontos de atenção estratégicos para a gestão."),
});
export type GenerateNarrativeSummaryOutput = z.infer<typeof GenerateNarrativeSummaryOutputSchema>;
