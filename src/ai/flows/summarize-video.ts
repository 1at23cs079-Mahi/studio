'use server';

/**
 * @fileOverview An AI agent for summarizing video content.
 *
 * - summarizeVideo - A function that handles the video summarization process.
 * - SummarizeVideoInput - The input type for the summarizeVideo function.
 * - SummarizeVideoOutput - The return type for the summarizeVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeVideoInput = z.infer<typeof SummarizeVideoInputSchema>;

const SummarizeVideoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video content.'),
});
export type SummarizeVideoOutput = z.infer<typeof SummarizeVideoOutputSchema>;

export async function summarizeVideo(
  input: SummarizeVideoInput
): Promise<SummarizeVideoOutput> {
  return summarizeVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVideoPrompt',
  input: { schema: SummarizeVideoInputSchema },
  output: { schema: SummarizeVideoOutputSchema },
  prompt: `You are a legal expert specializing in summarizing video content.
  The user has provided a video file of a legal proceeding, deposition, or lecture.
  Your task is to analyze the video and provide a concise, accurate summary of its key points, arguments, and conclusions.

  Video to analyze: {{media url=videoDataUri}}

  Focus on identifying the main speakers, the core legal arguments presented, any evidence discussed, and the final outcome or key takeaways.
  Return only the summary text.
  `,
});

const summarizeVideoFlow = ai.defineFlow(
  {
    name: 'summarizeVideoFlow',
    inputSchema: SummarizeVideoInputSchema,
    outputSchema: SummarizeVideoOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: `A video of a legal proceeding is provided. Summarize its content.`,
      config: {
        durationSeconds: 8,
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video summary: ' + operation.error.message);
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
