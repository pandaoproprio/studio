'use server';

/**
 * @fileOverview A flow that summarizes the account status of a tenant.
 *
 * - getAccountStatusSummary - A function that returns the account status summary.
 * - AccountStatusSummaryInput - The input type for the getAccountStatusSummary function.
 * - AccountStatusSummaryOutput - The return type for the getAccount-status-summary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AccountStatusSummaryInputSchema = z.object({
  tenantId: z.string().describe('The ID of the tenant to summarize.'),
  numberOfUsers: z.number(),
  modulesUsed: z.array(z.string()),
  currentYearSpend: z.number(),
});
export type AccountStatusSummaryInput = z.infer<typeof AccountStatusSummaryInputSchema>;

const AccountStatusSummaryOutputSchema = z.object({
  numberOfUsers: z.number().describe('The number of users in the tenant account.'),
  modulesUsed: z.array(z.string()).describe('The list of modules used by the tenant.'),
  spendLevel: z.string().describe('The current spend level of the tenant (e.g., low, medium, high).'),
  projectedSpendNextYear: z
    .string()
    .describe('The projected spend for the tenant for the following year.'),
});
export type AccountStatusSummaryOutput = z.infer<typeof AccountStatusSummaryOutputSchema>;

export async function getAccountStatusSummary(input: AccountStatusSummaryInput): Promise<AccountStatusSummaryOutput> {
  return accountStatusSummaryFlow(input);
}


const accountStatusSummaryPrompt = ai.definePrompt({
  name: 'accountStatusSummaryPrompt',
  input: {
    schema: AccountStatusSummaryInputSchema
  },
  output: {schema: AccountStatusSummaryOutputSchema},
  prompt: `Você é um analista de contas sênior para uma empresa de SaaS. Sua tarefa é analisar os dados de uso de um cliente (tenant) e gerar um resumo conciso.

  Dados do Tenant:
  - ID: {{{tenantId}}}
  - Número de Usuários: {{numberOfUsers}}
  - Módulos Utilizados: {{#each modulesUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Gasto no Ano Corrente: R$ {{currentYearSpend}}

  Sua Análise:
  1.  **Nível de Gasto (spendLevel):** Com base no gasto atual, classifique o nível de gasto como "Baixo" (abaixo de R$5.000), "Médio" (entre R$5.000 e R$15.000) ou "Alto" (acima de R$15.000).
  2.  **Gasto Projetado (projectedSpendNextYear):** Projete o gasto para o próximo ano. Assuma um crescimento de 15% sobre o gasto do ano corrente. Formate a saída como uma string em Reais (Ex: "R$ 11.500,00").
  3.  **Dados Originais:** Retorne o número de usuários e os módulos utilizados conforme fornecido.

  Retorne sua análise completa no formato JSON solicitado.
  `,
});

const accountStatusSummaryFlow = ai.defineFlow(
  {
    name: 'accountStatusSummaryFlow',
    inputSchema: AccountStatusSummaryInputSchema,
    outputSchema: AccountStatusSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await accountStatusSummaryPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate a summary.");
    }
    return output;
  }
);
