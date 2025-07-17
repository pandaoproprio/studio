
'use server';

/**
 * @fileOverview Generates a custom impact report using AI.
 *
 * - generateImpactReport - A function that generates an impact report.
 * - GenerateImpactReportInput - The input type for the generateImpactReport function.
 * - GenerateImpactReportOutput - The return type for the generateImpactReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImpactReportInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the project for which to generate an impact report.'),
  projectOutcomes: z.string().describe('A description of the project outcomes, including key metrics and qualitative results.'),
  desiredReportSections: z
    .string()
    .describe('A comma-separated list of report sections to include in the impact report.'),
});
export type GenerateImpactReportInput = z.infer<typeof GenerateImpactReportInputSchema>;

const GenerateImpactReportOutputSchema = z.object({
  report: z.string().describe('The generated impact report, formatted as a simple HTML string.'),
});
export type GenerateImpactReportOutput = z.infer<typeof GenerateImpactReportOutputSchema>;

export async function generateImpactReport(input: GenerateImpactReportInput): Promise<GenerateImpactReportOutput> {
  return generateImpactReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImpactReportPrompt',
  input: {schema: GenerateImpactReportInputSchema},
  output: {schema: GenerateImpactReportOutputSchema},
  prompt: `Você é um especialista em comunicação e relatórios de impacto para organizações do terceiro setor. Sua tarefa é gerar um relatório de impacto profissional e bem-estruturado com base nas informações fornecidas.

O formato de saída deve ser um HTML simples e limpo, utilizando tags como <h2>, <h3>, <p>, <ul>, e <li>. Não inclua as tags <html>, <head>, ou <body>.

**Informações do Projeto:**

*   **Descrição do Projeto:** {{{projectDescription}}}
*   **Resultados e Métricas Chave:** {{{projectOutcomes}}}
*   **Seções Solicitadas para o Relatório:** {{{desiredReportSections}}}

**Instruções:**
1.  Comece com uma seção de título (<h2>) para o nome geral do relatório.
2.  Crie cada uma das seções solicitadas usando títulos de nível 3 (<h3>).
3.  Dentro de cada seção, desenvolva o conteúdo em parágrafos (<p>) ou listas (<ul>/<li>) de forma clara e concisa.
4.  Incorpore os resultados e métricas chave de forma natural ao longo do texto.
5.  Adote um tom inspirador, mas profissional.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
    temperature: 0.7,
  },
});

const generateImpactReportFlow = ai.defineFlow(
  {
    name: 'generateImpactReportFlow',
    inputSchema: GenerateImpactReportInputSchema,
    outputSchema: GenerateImpactReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("A IA não conseguiu gerar o relatório.");
    }
    // Clean up potential markdown code fences from the output
    const cleanReport = output.report.replace(/```html\n?|```/g, '').trim();
    return { report: cleanReport };
  }
);
