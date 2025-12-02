
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

const SummarizeVideoOutputSchema = z.string().describe('A concise summary of the video content.');

export type SummarizeVideoOutput = z.infer<typeof SummarizeVideoOutputSchema>;

export async function summarizeVideo(
  input: SummarizeVideoInput
): Promise<SummarizeVideoOutput> {
    const stream = summarizeVideoFlow(input);
    let finalResponse = '';
    for await (const chunk of stream) {
        finalResponse = chunk;
    }
    return finalResponse;
}

const summarizeVideoFlow = ai.defineFlow(
  {
    name: 'summarizeVideoFlow',
    inputSchema: SummarizeVideoInputSchema,
    outputSchema: SummarizeVideoOutputSchema,
    stream: true,
  },
  async (input, streamingCallback) => {
    const { stream, response } = await ai.generateStream({
        model: 'googleai/gemini-2.5-pro-vision',
        prompt: `You are a legal expert specializing in summarizing video content.
        The user has provided a video file of a legal proceeding, deposition, or lecture.
        Your task is to analyze the video and provide a concise, accurate summary of its key points, arguments, and conclusions.

        Video to analyze: {{media url=videoDataUri}}

        Focus on identifying the main speakers, the core legal arguments presented, any evidence discussed, and the final outcome or key takeaways.
        Return only the summary text.
        `,
        input: { videoDataUri: input.videoDataUri }
    });

    for await (const chunk of stream) {
        if (chunk.text) {
            streamingCallback(chunk.text);
        }
    }
    const result = await response;
    return result.text;
  }
);
