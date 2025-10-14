/**
 * @fileOverview Schemas and types for the generateVideoStory flow.
 */
import { z } from 'zod';

export const GenerateVideoStoryInputSchema = z.object({
  storyText: z.string().min(20, "O texto precisa ter pelo menos 20 caracteres."),
  initialImageDataUri: z.string().optional().describe("An optional initial image for the story, as a data URI."),
});
export type GenerateVideoStoryInput = z.infer<typeof GenerateVideoStoryInputSchema>;

export const GenerateVideoStoryOutputSchema = z.object({
  title: z.string(),
  scenes: z.array(
    z.object({
      text: z.string(),
      imageUrl: z.string().describe("A data URI for the generated image. Expected format: 'data:image/png;base64,<encoded_data>'"),
      audioUri: z.string().describe("A data URI for the generated audio narration for this scene. Expected format: 'data:audio/wav;base64,<encoded_data>'"),
    })
  ),
});
export type GenerateVideoStoryOutput = z.infer<typeof GenerateVideoStoryOutputSchema>;
