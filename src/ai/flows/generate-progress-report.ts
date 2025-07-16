'use server';

/**
 * @fileOverview Generates a project progress report using AI based on Kanban board data.
 *
 * - generateProgressReport - A function that generates a progress report.
 * - GenerateProgressReportInput - The input type for the generateProgressReport function.
 * - GenerateProgressReportOutput - The return type for the generateProgressReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateProgressReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  tasksTodo: z.array(z.string()).describe('A list of tasks in the "To Do" column.'),
  tasksInProgress: z.array(z.string()).describe('A list of tasks in the "In Progress" column.'),
  tasksDone: z.array(z.string()).describe('A list of tasks in the "Done" column.'),
});
export type GenerateProgressReportInput = z.infer<typeof GenerateProgressReportInputSchema>;

export const GenerateProgressReportOutputSchema = z.object({
  report: z.string().describe('The generated progress report in Markdown format.'),
});
export type GenerateProgressReportOutput = z.infer<typeof GenerateProgressReportOutputSchema>;

export async function generateProgressReport(input: GenerateProgressReportInput): Promise<GenerateProgressReportOutput> {
  return generateProgressReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgressReportPrompt',
  input: {schema: GenerateProgressReportInputSchema},
  output: {schema: GenerateProgressReportOutputSchema},
  prompt: `Você é um gerente de projetos sênior e sua tarefa é escrever um relatório de progresso conciso e profissional para o projeto "{{projectName}}".

Use as listas de tarefas a seguir, extraídas diretamente do quadro Kanban do projeto, para basear seu relatório.

**Tarefas Concluídas (Done):**
{{#if tasksDone}}
{{#each tasksDone}}
- {{this}}
{{/each}}
{{else}}
- Nenhuma tarefa concluída recentemente.
{{/if}}

**Tarefas em Andamento (In Progress):**
{{#if tasksInProgress}}
{{#each tasksInProgress}}
- {{this}}
{{/each}}
{{else}}
- Nenhuma tarefa em andamento no momento.
{{/if}}

**Próximas Tarefas (To Do):**
{{#if tasksTodo}}
{{#each tasksTodo}}
- {{this}}
{{/each}}
{{else}}
- Nenhuma tarefa planejada no backlog imediato.
{{/if}}

**Instruções para o Relatório:**
- Comece com um parágrafo de resumo geral (Sumário Executivo).
- Crie seções claras para "Conquistas Recentes", "Trabalho em Andamento" e "Próximos Passos".
- Seja otimista, mas realista. Se não houver tarefas em uma seção, reconheça isso de forma profissional.
- O formato de saída deve ser Markdown.
`,
  config: {
    temperature: 0.7,
  }
});

const generateProgressReportFlow = ai.defineFlow(
  {
    name: 'generateProgressReportFlow',
    inputSchema: GenerateProgressReportInputSchema,
    outputSchema: GenerateProgressReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
