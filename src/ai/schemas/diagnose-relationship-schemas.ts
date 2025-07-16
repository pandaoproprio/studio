/**
 * @fileOverview Schemas and types for the diagnoseRelationship flow.
 */
import { z } from 'zod';

const InteractionSchema = z.object({
  type: z.string(),
  date: z.string(),
  notes: z.string(),
});

export const DiagnoseRelationshipInputSchema = z.object({
  contactName: z.string().describe("The name of the contact."),
  interactions: z.array(InteractionSchema).describe("The history of interactions with the contact."),
});
export type DiagnoseRelationshipInput = z.infer<typeof DiagnoseRelationshipInputSchema>;

export const DiagnoseRelationshipOutputSchema = z.object({
  engagementLevel: z.string().describe("The assessed engagement level of the contact (e.g., Alto, Médio, Baixo)."),
  overallSentiment: z.string().describe("The overall sentiment of the relationship (e.g., Positivo, Neutro, Negativo)."),
  nextActionSuggestion: z.string().describe("A concrete suggestion for the next action to take with this contact."),
});
export type DiagnoseRelationshipOutput = z.infer<typeof DiagnoseRelationshipOutputSchema>;
