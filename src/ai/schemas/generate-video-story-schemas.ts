/**
 * @fileOverview Schemas and types for the generateVideoStory flow.
 */
import { z } from 'zod';

export const GenerateVideoStoryOutputSchema = z.object({
  title: z.string(),
  audioUri: z.string().describe("A data URI for the generated audio narration. Expected format: 'data:audio/wav;base64,<encoded_data>'"),
  scenes: z.array(
    z.object({
      text: z.string(),
      imageUrl: z.string().describe("A data URI for the generated image. Expected format: 'data:image/png;base64,<encoded_data>'"),
    })
  ),
});
export type GenerateVideoStoryOutput = z.infer<typeof GenerateVideoStoryOutputSchema>;
