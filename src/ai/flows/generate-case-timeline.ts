'use server';

/**
 * @fileOverview Generates a timeline of events for a given case, including expected next steps.
 *
 * - generateCaseTimeline - A function that generates the timeline.
 * - GenerateCaseTimelineInput - The input type for the generateCaseTimeline function.
 * - GenerateCaseTimelineOutput - The return type for the generateCaseTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaseTimelineInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the case, including key events and dates.'),
});

export type GenerateCaseTimelineInput = z.infer<typeof GenerateCaseTimelineInputSchema>;

const GenerateCaseTimelineOutputSchema = z.object({
  timeline: z.string().describe('A timeline of events with expected next steps.'),
});

export type GenerateCaseTimelineOutput = z.infer<typeof GenerateCaseTimelineOutputSchema>;

export async function generateCaseTimeline(input: GenerateCaseTimelineInput): Promise<GenerateCaseTimelineOutput> {
  return generateCaseTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaseTimelinePrompt',
  input: {schema: GenerateCaseTimelineInputSchema},
  output: {schema: GenerateCaseTimelineOutputSchema},
  prompt: `You are a legal expert specializing in creating case timelines.

  Based on the provided case details, generate a timeline of events, including expected next steps.
  Leverage your knowledge of legal procedures and historical data to predict these steps accurately.

  Case Details: {{{caseDetails}}}
  `,
});

const generateCaseTimelineFlow = ai.defineFlow(
  {
    name: 'generateCaseTimelineFlow',
    inputSchema: GenerateCaseTimelineInputSchema,
    outputSchema: GenerateCaseTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
