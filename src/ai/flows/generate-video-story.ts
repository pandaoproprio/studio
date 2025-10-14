
'use server';

/**
 * @fileOverview An AI flow to generate a video story from a text input.
 *
 * - generateVideoStory - A function that handles the video generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import { GenerateVideoStoryInputSchema, GenerateVideoStoryOutputSchema, type GenerateVideoStoryInput, type GenerateVideoStoryOutput } from '@/ai/schemas/generate-video-story-schemas';

const SceneSchema = z.object({
  text: z.string().describe('The narration text for this scene.'),
  visuals: z.string().describe('A detailed description of the visuals for this scene, to be used in an image generation model.'),
});

const ScriptSchema = z.object({
  title: z.string().describe('A compelling title for the story.'),
  scenes: z.array(SceneSchema),
});

const generateScriptPrompt = ai.definePrompt({
    name: 'generateScriptPrompt',
    input: {schema: z.string()},
    output: {schema: ScriptSchema},
    prompt: `You are a creative storyteller and video producer. Your task is to transform the following text into a short, compelling video script. The script should be divided into scenes, each with a piece of narration and a detailed description of the visuals.

    Input text:
    "{{prompt}}"

    Generate a script with a title and at least 3-5 scenes. The narration should be engaging and the visual descriptions vivid and suitable for an AI image generator.
    `,
    config: {
        temperature: 0.8,
    }
});

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      const bufs: Buffer[] = [];
      writer.on('error', reject);
      writer.on('data', (d) => bufs.push(d));
      writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
  
      writer.write(pcmData);
      writer.end();
    });
}

const generateNarrationFlow = ai.defineFlow(
    {
      name: 'generateNarrationFlow',
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (narrationText) => {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: narrationText,
      });
  
      if (!media) {
        throw new Error('No audio media returned from TTS model.');
      }
  
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
  
      const wavBase64 = await toWav(audioBuffer);
      return `data:audio/wav;base64,${wavBase64}`;
    }
);

const GenerateImageInputSchema = z.object({
    visualsDescription: z.string(),
    referenceImageUrl: z.string().optional(),
});

const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: z.string(),
    },
    async ({ visualsDescription, referenceImageUrl }) => {
        const prompt: any[] = [{ text: `Generate a compelling, photorealistic image based on this description: ${visualsDescription}` }];

        if (referenceImageUrl) {
            prompt.unshift({ media: { url: referenceImageUrl } });
            prompt[1].text = `Using the reference image, modify it to match this new description: ${visualsDescription}`;
        }
        
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        if (!media) {
            throw new Error('Image generation failed.');
        }
        return media.url;
    }
);

const generateVideoStoryFlow = ai.defineFlow(
  {
    name: 'generateVideoStoryFlow',
    inputSchema: GenerateVideoStoryInputSchema,
    outputSchema: GenerateVideoStoryOutputSchema,
  },
  async ({ storyText, initialImageDataUri }) => {
    // 1. Generate the script
    const scriptResponse = await generateScriptPrompt(storyText);
    const script = scriptResponse.output;
    if (!script) {
        throw new Error('Failed to generate script.');
    }

    const processedScenes = [];
    let previousImageUrl = initialImageDataUri;

    // 2. Generate audio and images for each scene sequentially
    for (const scene of script.scenes) {
        const [imageUrl, audioUri] = await Promise.all([
            generateImageFlow({
                visualsDescription: scene.visuals,
                referenceImageUrl: previousImageUrl,
            }),
            generateNarrationFlow(scene.text)
        ]);

        processedScenes.push({
            text: scene.text,
            imageUrl,
            audioUri,
        });

        // Use the newly generated image as reference for the next scene
        previousImageUrl = imageUrl;
    }

    // 4. Combine results
    return {
      title: script.title,
      scenes: processedScenes,
    };
  }
);


export async function generateVideoStory(input: GenerateVideoStoryInput): Promise<GenerateVideoStoryOutput> {
    return generateVideoStoryFlow(input);
}
