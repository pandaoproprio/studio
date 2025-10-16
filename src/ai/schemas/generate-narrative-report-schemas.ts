/**
 * @fileOverview Schemas and types for the generateNarrativeReport flow.
 */
import { z } from 'zod';

const ActionSchema = z.object({
    name: z.string().min(1, "O nome da ação é obrigatório."),
    dateAndLocation: z.string().min(1, "A data e o local são obrigatórios."),
    audience: z.string().min(1, "O público alcançado é obrigatório."),
    results: z.string().min(1, "Os resultados são obrigatórios."),
    challenges: z.string().min(1, "Os desafios são obrigatórios."),
    evaluation: z.string().min(1, "A avaliação é obrigatória."),
    images: z.array(z.string().url()).optional().describe("Uma lista de URLs de imagem (data URIs) para a ação."),
});

export const GenerateNarrativeReportInputSchema = z.object({
  projectName: z.string().min(1, "O nome do projeto é obrigatório."),
  coordinatorName: z.string().min(1, "O nome do coordenador é obrigatório."),
  monthYear: z.string().min(1, "O mês/ano de referência é obrigatório."),
  thematicAreas: z.string().min(1, "As áreas temáticas são obrigatórias."),
  projectChanges: z.object({
      scopeChange: z.string().min(1, "A resposta sobre mudança de escopo é obrigatória."),
      objectivesChange: z.string().min(1, "A resposta sobre mudança de objetivos é obrigatória."),
      outsideScopeActions: z.string().min(1, "A resposta sobre ações fora do escopo é obrigatória."),
  }),
  actions: z.array(ActionSchema).min(1, "É necessário registrar pelo menos uma ação."),
  indicators: z.object({
      directImpact: z.string().min(1, "O indicador de impacto direto é obrigatório."),
      indirectImpact: z.string().min(1, "O indicador de impacto indireto é obrigatório."),
      itemsDistributed: z.string().min(1, "O indicador de itens distribuídos é obrigatório."),
  }),
  observations: z.string().min(1, "A seção de observações é obrigatória."),
});

export type GenerateNarrativeReportInput = z.infer<typeof GenerateNarrativeReportInputSchema>;

export const GenerateNarrativeReportOutputSchema = z.object({
    report: z.string().describe('The generated narrative report in HTML format.'),
});

export type GenerateNarrativeReportOutput = z.infer<typeof GenerateNarrativeReportOutputSchema>;
