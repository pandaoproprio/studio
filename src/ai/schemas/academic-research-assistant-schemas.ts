/**
 * @fileOverview Schemas and types for the academicResearchAssistant flow.
 */
import { z } from 'zod';

export const AcademicResearchAssistantInputSchema = z.object({
  topic: z.string().min(10, "O tópico de pesquisa deve ter pelo menos 10 caracteres."),
  researchType: z.string().describe("O tipo de pesquisa desejada (básica, aplicada, quantitativa, qualitativa)."),
  targetAudience: z.string().describe("O público para quem a pesquisa se destina."),
});
export type AcademicResearchAssistantInput = z.infer<typeof AcademicResearchAssistantInputSchema>;

const ResearchPlanSchema = z.object({
    introduction: z.string().describe("Uma breve introdução ao tema da pesquisa."),
    researchQuestions: z.array(z.string()).describe("Uma lista de 2 a 3 perguntas-chave que guiarão a pesquisa."),
    methodology: z.string().describe("Uma breve descrição da metodologia de pesquisa sugerida."),
});

const SourceSchema = z.object({
    title: z.string().describe("O título do artigo, livro ou tese."),
    authors: z.string().describe("Os autores da publicação."),
    publication: z.string().describe("O nome do periódico, conferência ou editora."),
    link: z.string().url().describe("O link direto para acessar a fonte."),
});

export const AcademicResearchAssistantOutputSchema = z.object({
    plan: ResearchPlanSchema.describe("O plano de pesquisa estruturado."),
    sources: z.array(SourceSchema).describe("Uma lista de 3 a 5 fontes acadêmicas relevantes."),
});
export type AcademicResearchAssistantOutput = z.infer<typeof AcademicResearchAssistantOutputSchema>;
