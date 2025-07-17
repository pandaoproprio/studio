/**
 * @fileOverview Schemas and types for the generateProgressReport flow.
 */
import { z } from 'zod';

export const GenerateProgressReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  tasksTodo: z.array(z.string()).describe('A list of tasks in the "To Do" column.'),
  tasksInProgress: z.array(z.string()).describe('A list of tasks in the "In Progress" column.'),
  tasksDone: z.array(z.string()).describe('A list of tasks in the "Done" column.'),
  targetAudience: z.string().describe('The target audience for the report (e.g., Stakeholders, Internal Team).'),
  tone: z.string().describe('The desired tone for the report (e.g., Formal, Optimistic, Cautious).'),
  additionalContext: z.string().optional().describe('Optional additional context provided by the user.'),
});
export type GenerateProgressReportInput = z.infer<typeof GenerateProgressReportInputSchema>;

export const GenerateProgressReportOutputSchema = z.object({
  report: z.string().describe('The generated progress report in HTML format.'),
});
export type GenerateProgressReportOutput = z.infer<typeof GenerateProgressReportOutputSchema>;
