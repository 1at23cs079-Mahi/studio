'use server';

/**
 * @fileOverview A document analysis AI agent that annotates clauses, suggests redline edits,
 * and provides matching precedent for each flagged clause in a legal document.
 *
 * - analyzeDocumentAndSuggestEdits - A function that handles the document analysis process.
 * - AnalyzeDocumentAndSuggestEditsInput - The input type for the analyzeDocumentAndSuggestEdits function.
 * - AnalyzeDocumentAndSuggestEditsOutput - The return type for the analyzeDocumentAndSuggestEdits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDocumentAndSuggestEditsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentAndSuggestEditsInput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsInputSchema
>;

const AnalyzeDocumentAndSuggestEditsOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe(
      'The analysis results, including annotated clauses, suggested redline edits, and matching precedent for each flagged clause.'
    ),
});
export type AnalyzeDocumentAndSuggestEditsOutput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsOutputSchema
>;

export async function analyzeDocumentAndSuggestEdits(
  input: AnalyzeDocumentAndSuggestEditsInput
): Promise<AnalyzeDocumentAndSuggestEditsOutput> {
  return analyzeDocumentAndSuggestEditsFlow(input);
}

const analyzeDocumentAndSuggestEditsPrompt = ai.definePrompt({
  name: 'analyzeDocumentAndSuggestEditsPrompt',
  input: {schema: AnalyzeDocumentAndSuggestEditsInputSchema},
  output: {schema: AnalyzeDocumentAndSuggestEditsOutputSchema},
  prompt: `You are a legal expert specializing in analyzing legal documents.

You will use this document to identify clauses, suggest redline edits, and provide matching precedent for each flagged clause.

Document: {{media url=documentDataUri}}

Analyze the document and provide the analysis results. Focus on potential issues, inconsistencies, and areas for improvement.

Ensure that the analysis results include specific suggestions for redline edits and relevant precedent to support each suggestion.
`,
});

const analyzeDocumentAndSuggestEditsFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentAndSuggestEditsFlow',
    inputSchema: AnalyzeDocumentAndSuggestEditsInputSchema,
    outputSchema: AnalyzeDocumentAndSuggestEditsOutputSchema,
  },
  async input => {
    const {output} = await analyzeDocumentAndSuggestEditsPrompt(input);
    return output!;
  }
);
