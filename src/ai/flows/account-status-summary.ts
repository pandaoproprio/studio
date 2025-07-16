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

// TODO: Fetch tenant data from Firestore or other data source using the tenantId
// This is a placeholder implementation that returns dummy data
const tenantData = {
  numberOfUsers: 50,
  modulesUsed: ['Projects', 'AnnIRH', 'CRM'],
  spendLevel: 'medium',
  projectedSpendNextYear: '$10,000',
};


const accountStatusSummaryPrompt = ai.definePrompt({
  name: 'accountStatusSummaryPrompt',
  input: {schema: AccountStatusSummaryInputSchema},
  output: {schema: AccountStatusSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes the account status of a tenant.

  Given the tenant ID: {{{tenantId}}}, and the following data:
  - Number of users: ${tenantData.numberOfUsers}
  - Modules used: ${tenantData.modulesUsed.join(', ')}
  - Spend level: ${tenantData.spendLevel}
  - Projected spend for the following year: ${tenantData.projectedSpendNextYear}

  Return the information in the requested JSON format.
  `,
});

const accountStatusSummaryFlow = ai.defineFlow(
  {
    name: 'accountStatusSummaryFlow',
    inputSchema: AccountStatusSummaryInputSchema,
    outputSchema: AccountStatusSummaryOutputSchema,
  },
  async input => {
    // In a real app, you would fetch tenant data from a database.
    // Here we are using dummy data defined above.
    const {output} = await accountStatusSummaryPrompt(input);
    return output!;
  }
);
