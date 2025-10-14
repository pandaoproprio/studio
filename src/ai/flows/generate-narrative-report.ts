'use server';
/**
 * @fileOverview An AI flow to generate a narrative project execution report.
 *
 * - generateNarrativeReport - A function that generates a structured narrative report.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateNarrativeReportInputSchema,
    GenerateNarrativeReportOutputSchema,
    type GenerateNarrativeReportInput,
    type GenerateNarrativeReportOutput
} from '@/ai/schemas/generate-narrative-report-schemas';

export async function generateNarrativeReport(input: GenerateNarrativeReportInput): Promise<GenerateNarrativeReportOutput> {
  return generateNarrativeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNarrativeReportPrompt',
  input: {schema: GenerateNarrativeReportInputSchema},
  output: {schema: GenerateNarrativeReportOutputSchema},
  prompt: `Você é um especialista em gestão de projetos e comunicação para o terceiro setor. Sua tarefa é criar um Relatório Narrativo de Execução Mensal profissional, coeso e bem estruturado, com base nos dados fornecidos pelo usuário. O formato de saída deve ser um HTML simples e limpo.

  **Dados do Projeto:**
  - **Nome do Projeto:** {{{projectName}}}
  - **Mês/Ano do Relatório:** {{{monthYear}}}
  - **Coordenador:** {{{coordinatorName}}}
  - **Áreas Temáticas:** {{{thematicAreas}}}

  **Informações Fornecidas:**
  - **Alterações no Projeto:**
    - Solicitação de mudança no escopo: {{{projectChanges.scopeChange}}}
    - Solicitação de mudança nos objetivos: {{{projectChanges.objectivesChange}}}
    - Realização de ações fora do escopo: {{{projectChanges.outsideScopeActions}}}

  - **Ações Desenvolvidas:**
    {{#each actions}}
    - **Ação {{@index_1}}:**
        - Nome: {{this.name}}
        - Data e Local: {{this.dateAndLocation}}
        - Público: {{this.audience}}
        - Resultados: {{{this.results}}}
        - Desafios: {{{this.challenges}}}
        - Avaliação: {{{this.evaluation}}}
        {{#if this.images}}
        - **Imagens:**
            {{#each this.images}}
            <img src="{{this}}" alt="Imagem da ação {{../name}}" style="max-width: 500px; margin-top: 10px; border-radius: 8px;" />
            {{/each}}
        {{/if}}
    {{/each}}

  - **Indicadores:**
    - Impacto Direto: {{{indicators.directImpact}}}
    - Impacto Indireto: {{{indicators.indirectImpact}}}
    - Itens Distribuídos: {{{indicators.itemsDistributed}}}

  - **Observações:**
    {{{observations}}}

  **Sua Missão:**
  Com base nos dados acima, construa o relatório em HTML simples, usando tags como <h1>, <h2>, <h3>, <p>, <ul>, <li> e <strong>. Siga a estrutura clássica de um relatório narrativo:

  1.  **Cabeçalho:** Crie um título claro para o relatório.
  2.  **Sumário de Informações:** Apresente o nome do projeto, coordenador e mês de referência.
  3.  **Corpo do Relatório:**
      - **1. Áreas Temáticas:** Liste as áreas temáticas.
      - **1.1 Alterações no Projeto:** Apresente as respostas sobre as alterações de forma clara.
      - **1.2 Ações Desenvolvidas no Período:** Para cada ação, crie um subtítulo (<h3>) e detalhe os pontos (resultados, desafios, avaliação) usando o conteúdo HTML fornecido. Se houver imagens, insira-as após a avaliação.
      - **2. Indicadores:** Apresente os indicadores de impacto de forma organizada.
      - **3. Observações:** Inclua a seção de observações, resumindo os pontos chave do mês, como dificuldades e aprendizados.

  Seja objetivo e profissional. O relatório deve ser claro, informativo e refletir o trabalho realizado no período.`,
});

const generateNarrativeReportFlow = ai.defineFlow(
  {
    name: 'generateNarrativeReportFlow',
    inputSchema: GenerateNarrativeReportInputSchema,
    outputSchema: GenerateNarrativeReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("A IA não conseguiu gerar o relatório narrativo.");
    }
    const cleanReport = output.report.replace(/```html\n?|```/g, '').trim();
    return { report: cleanReport };
  }
);
