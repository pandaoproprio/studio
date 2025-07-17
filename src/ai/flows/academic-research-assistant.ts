'use server';
/**
 * @fileOverview An AI flow to act as an academic research assistant.
 *
 * - academicResearchAssistant - A function that generates a research plan and finds sources.
 */

import {ai} from '@/ai/genkit';
import {
    AcademicResearchAssistantInputSchema,
    AcademicResearchAssistantOutputSchema,
    type AcademicResearchAssistantInput,
    type AcademicResearchAssistantOutput
} from '@/ai/schemas/academic-research-assistant-schemas';

export async function academicResearchAssistant(input: AcademicResearchAssistantInput): Promise<AcademicResearchAssistantOutput> {
  return academicResearchAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'academicResearchAssistantPrompt',
  input: {schema: AcademicResearchAssistantInputSchema},
  output: {schema: AcademicResearchAssistantOutputSchema},
  prompt: `Você é um pesquisador acadêmico sênior e especialista em metodologia científica. Sua tarefa é ajudar um usuário a estruturar o início de uma pesquisa acadêmica.

  **Texto Informativo de Base (Seu Conhecimento):**
  A pesquisa acadêmica é um processo sistemático de investigação.
  - **Importância:** Aprofunda conhecimento, desenvolve habilidades críticas, pode ter relevância social.
  - **Tipos:**
    - **Básica:** Conhecimento teórico.
    - **Aplicada:** Solução de problemas práticos.
    - **Quantitativa:** Dados numéricos e estatística.
    - **Qualitativa:** Dados descritivos e interpretação de contextos.
  - **Fontes Confiáveis:** Google Acadêmico, Portal de Periódicos da CAPES, SciELO, bases de dados especializadas.

  **Tarefa do Usuário:**
  - **Tópico de Pesquisa:** {{{topic}}}
  - **Tipo de Pesquisa Desejado:** {{{researchType}}}
  - **Público-Alvo do Estudo:** {{{targetAudience}}}

  **Sua Missão:**
  Com base no tópico fornecido pelo usuário, gere o seguinte, no formato JSON solicitado:

  1.  **Plano de Pesquisa:**
      - **Introdução:** Elabore um parágrafo introdutório conciso que contextualize o tema e sua relevância, considerando o público-alvo.
      - **Perguntas Norteadoras:** Formule de 2 a 3 perguntas de pesquisa claras e focadas que possam guiar o estudo.
      - **Metodologia:** Sugira uma abordagem metodológica breve (ex: "revisão de literatura", "estudo de caso", "análise de dados quantitativos de surveys"), alinhada com o tipo de pesquisa solicitado.

  2.  **Fontes Acadêmicas Recomendadas:**
      - **Pesquisa:** Simule uma busca em fontes como Google Acadêmico, SciELO, etc.
      - **Seleção:** Forneça de 3 a 5 referências acadêmicas (artigos, teses, livros) que pareçam altamente relevantes para o tópico.
      - **Formatação:** Para cada fonte, forneça: título, autores (seja realista, cite 1 a 3 autores com sobrenomes comuns), publicação (nome de um periódico ou conferência fictício, mas plausível) e um link de exemplo (use 'https://scholar.google.com/scholar?q=...' ou 'https://scielo.org/...' e complete com uma query relevante).

  Seja objetivo, estruturado e forneça um ponto de partida acionável para o usuário.`,
  config: {
    temperature: 0.7,
  }
});

const academicResearchAssistantFlow = ai.defineFlow(
  {
    name: 'academicResearchAssistantFlow',
    inputSchema: AcademicResearchAssistantInputSchema,
    outputSchema: AcademicResearchAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
