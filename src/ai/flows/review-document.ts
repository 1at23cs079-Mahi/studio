'use server';

/**
 * @fileOverview A flexible document review AI agent that can perform tasks
 * like summarization, analysis, and data extraction based on a user-provided prompt.
 *
 * - reviewDocument - A function that handles the document review process.
 * - ReviewDocumentInput - The input type for the reviewDocument function.
 * - ReviewDocumentOutput - The return type for the reviewDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('The user\'s instruction for what to do with the document.'),
});
export type ReviewDocumentInput = z.infer<typeof ReviewDocumentInputSchema>;

const ReviewDocumentOutputSchema = z.object({
  result: z
    .string()
    .describe(
      'The result of the review, based on the user\'s prompt.'
    ),
});
export type ReviewDocumentOutput = z.infer<typeof ReviewDocumentOutputSchema>;

export async function reviewDocument(
  input: ReviewDocumentInput
): Promise<ReviewDocumentOutput> {
  return reviewDocumentFlow(input);
}

const reviewDocumentPrompt = ai.definePrompt({
  name: 'reviewDocumentPrompt',
  input: {schema: ReviewDocumentInputSchema},
  output: {schema: ReviewDocumentOutputSchema},
  prompt: `You are a legal expert specializing in reviewing and analyzing legal documents.
You will be given a document and a prompt from a user instructing you what to do.
Execute the user's instruction on the provided document.

Document: {{media url=documentDataUri}}
User's Instruction: {{{prompt}}}
`,
});

const reviewDocumentFlow = ai.defineFlow(
  {
    name: 'reviewDocumentFlow',
    inputSchema: ReviewDocumentInputSchema,
    outputSchema: ReviewDocumentOutputSchema,
  },
  async input => {
    if (!input.documentDataUri) {
      return { result: "Please upload a document to be reviewed." };
    }
    if (!input.prompt) {
        return { result: "Please provide instructions on what you want me to do with the document." };
    }
    const {output} = await reviewDocumentPrompt(input);
    return output!;
  }
);
