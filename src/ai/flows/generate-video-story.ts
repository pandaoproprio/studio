
'use server';

/**
 * @fileOverview An AI flow to generate a video story from a text input.
 *
 * - generateVideoStory - A function that handles the video generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import { GenerateVideoStoryOutputSchema, type GenerateVideoStoryOutput } from '@/ai/schemas/generate-video-story-schemas';

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

const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (visualsDescription) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Generate a compelling, photorealistic image based on this description: ${visualsDescription}`,
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
    inputSchema: z.string(),
    outputSchema: GenerateVideoStoryOutputSchema,
  },
  async (storyText) => {
    // 1. Generate the script
    const scriptResponse = await generateScriptPrompt(storyText);
    const script = scriptResponse.output;
    if (!script) {
        throw new Error('Failed to generate script.');
    }

    // 2. Generate images and audio for each scene in parallel
    const sceneProcessingPromises = script.scenes.map(async (scene) => {
        const [imageUrl, audioUri] = await Promise.all([
            generateImageFlow(scene.visuals),
            generateNarrationFlow(scene.text)
        ]);
        return {
            text: scene.text,
            imageUrl,
            audioUri,
        };
    });
    
    // 3. Await all promises
    const processedScenes = await Promise.all(sceneProcessingPromises);

    // 4. Combine results
    return {
      title: script.title,
      scenes: processedScenes,
    };
  }
);


export async function generateVideoStory(text: string): Promise<GenerateVideoStoryOutput> {
    return generateVideoStoryFlow(text);
}
