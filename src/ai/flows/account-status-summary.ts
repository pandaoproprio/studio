'use server';

/**
 * @fileOverview A flow that summarizes the account status of a tenant.
 *
 * - getAccountStatusSummary - A function that returns the account status summary.
 * - AccountStatusSummaryInput - The input type for the getAccountStatusSummary function.
 * - AccountStatusSummaryOutput - The return type for the getAccountStatusSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccountStatusSummaryInputSchema = z.object({
  tenantId: z.string().describe('The ID of the tenant to summarize.'),
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
  input: {schema: AccountStatusSummaryInputSchema},
  output: {schema: AccountStatusSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes the account status of a tenant.

  Given the tenant ID: {{{tenantId}}}, provide a summary of the account status, including:
  - Number of users
  - Modules used
  - Spend level (low, medium, high)
  - Projected spend for the following year

  Return the information in JSON format.
  `,
});

const accountStatusSummaryFlow = ai.defineFlow(
  {
    name: 'accountStatusSummaryFlow',
    inputSchema: AccountStatusSummaryInputSchema,
    outputSchema: AccountStatusSummaryOutputSchema,
  },
  async input => {
    // TODO: Fetch tenant data from Firestore or other data source using the tenantId
    // This is a placeholder implementation that returns dummy data

    // Replace the following with actual data retrieval logic
    const tenantData = {
      numberOfUsers: 50,
      modulesUsed: ['Projects', 'AnnIRH', 'CRM'],
      spendLevel: 'medium',
      projectedSpendNextYear: '$10,000',
    };

    const {output} = await accountStatusSummaryPrompt({
      ...input,
      numberOfUsers: tenantData.numberOfUsers,
      modulesUsed: tenantData.modulesUsed,
      spendLevel: tenantData.spendLevel,
      projectedSpendNextYear: tenantData.projectedSpendNextYear,
    });
    return output!;
  }
);
