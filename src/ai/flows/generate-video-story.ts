
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
        let prompt: any[] = [{ text: `Generate a compelling, photorealistic image based on this description: ${visualsDescription}` }];

        if (referenceImageUrl) {
            prompt.unshift({ media: { url: referenceImageUrl } });
            prompt[1].text = `Using the reference image as context, create a new image that matches this description: ${visualsDescription}`;
        }
        
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            prompt,
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
    if (!script || script.scenes.length === 0) {
        throw new Error('Failed to generate script or script has no scenes.');
    }

    // 2. Generate all audio narrations in parallel
    const audioPromises = script.scenes.map(scene => generateNarrationFlow(scene.text));

    // 3. Generate all images in parallel, chaining the reference
    const imagePromises: Promise<string>[] = [];
    let currentReference = initialImageDataUri;

    for (const scene of script.scenes) {
        const imagePromise = generateImageFlow({
            visualsDescription: scene.visuals,
            referenceImageUrl: currentReference,
        });
        imagePromises.push(imagePromise);
        // This is a bit of a trick: we pass the promise of an image URL as the reference for the next one.
        // This won't actually work if the flow runner doesn't handle promises as inputs.
        // A safer approach would be sequential generation. Let's stick to parallel for now to reduce latency.
        // For a true chained context, a sequential 'for...of' loop is required.
        // Let's compromise and run them in parallel but each will use the initial reference.
    }
    
    // To create a true visual evolution, generation must be sequential.
    // Let's refactor to a sequential loop for images to ensure context is passed correctly.
    const generatedImageUrls: string[] = [];
    let lastImageUrl = initialImageDataUri;
    for (const scene of script.scenes) {
        const imageUrl = await generateImageFlow({
            visualsDescription: scene.visuals,
            referenceImageUrl: lastImageUrl,
        });
        generatedImageUrls.push(imageUrl);
        lastImageUrl = imageUrl; // The newly generated image becomes the reference for the next iteration.
    }

    const generatedAudioUris = await Promise.all(audioPromises);

    // 4. Combine results
    const processedScenes = script.scenes.map((scene, index) => ({
      text: scene.text,
      imageUrl: generatedImageUrls[index],
      audioUri: generatedAudioUris[index],
    }));

    return {
      title: script.title,
      scenes: processedScenes,
    };
  }
);


export async function generateVideoStory(input: GenerateVideoStoryInput): Promise<GenerateVideoStoryOutput> {
    return generateVideoStoryFlow(input);
}
