'use server';

/**
 * @fileOverview Generates a project progress report using AI based on Kanban board data.
 *
 * - generateProgressReport - A function that generates a progress report.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateProgressReportInputSchema,
    GenerateProgressReportOutputSchema,
    type GenerateProgressReportInput,
    type GenerateProgressReportOutput
} from '@/ai/schemas/generate-progress-report-schemas';


export async function generateProgressReport(input: GenerateProgressReportInput): Promise<GenerateProgressReportOutput> {
  return generateProgressReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProgressReportPrompt',
  input: {schema: GenerateProgressReportInputSchema},
  output: {schema: GenerateProgressReportOutputSchema},
  prompt: `Você é um gerente de projetos sênior e sua tarefa é escrever um relatório de progresso conciso e profissional para o projeto "{{projectName}}".

**Público-Alvo:** {{targetAudience}}
**Tom Desejado:** {{tone}}

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

**Contexto Adicional Fornecido pelo Usuário:**
{{#if additionalContext}}
{{{additionalContext}}}
{{else}}
- Nenhum contexto adicional fornecido.
{{/if}}

**Instruções para o Relatório:**
- Comece com um parágrafo de resumo geral (Sumário Executivo), adaptando a linguagem para o **Público-Alvo** e o **Tom Desejado**.
- Crie seções claras para "Conquistas Recentes", "Trabalho em Andamento" e "Próximos Passos".
- Incorpore o **Contexto Adicional** de forma natural no relatório para dar mais cor e profundidade à análise.
- Seja realista, mas alinhe o sentimento geral com o **Tom Desejado**.
- O formato de saída deve ser HTML simples, usando tags como <strong>, <ul>, <li>. Não inclua <html> ou <body> tags.
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
