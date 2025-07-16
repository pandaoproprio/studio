/**
 * @fileOverview Schemas and types for the generateProgressReport flow.
 */
import { z } from 'zod';

export const GenerateProgressReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  tasksTodo: z.array(z.string()).describe('A list of tasks in the "To Do" column.'),
  tasksInProgress: z.array(z.string()).describe('A list of tasks in the "In Progress" column.'),
  tasksDone: z.array(z.string()).describe('A list of tasks in the "Done" column.'),
});
export type GenerateProgressReportInput = z.infer<typeof GenerateProgressReportInputSchema>;

export const GenerateProgressReportOutputSchema = z.object({
  report: z.string().describe('The generated progress report in Markdown format.'),
});
export type GenerateProgressReportOutput = z.infer<typeof GenerateProgressReportOutputSchema>;
