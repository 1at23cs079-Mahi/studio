
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
      "A legal document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported file types: PDF, DOCX, TXT."
    ),
});
export type AnalyzeDocumentAndSuggestEditsInput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsInputSchema
>;

const AnalysisResultSchema = z.object({
    annotatedClauses: z.string().describe("A summary of the key clauses identified in the document."),
    suggestedEdits: z.string().describe("Specific redline edits suggested for the flagged clauses. Provide actionable and clear suggestions."),
    matchingPrecedent: z.string().describe("Relevant legal precedents that match or support the suggested edits for each flagged clause."),
});

const AnalyzeDocumentAndSuggestEditsOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe(
      'A JSON string containing the analysis results. The JSON object should have three keys: "annotatedClauses", "suggestedEdits", and "matchingPrecedent".'
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
  output: {schema: z.object({ analysisResults: AnalysisResultSchema }) },
  prompt: `You are a legal expert specializing in contract analysis. Your task is to review the provided legal document and perform a comprehensive analysis.

Document to Analyze: {{media url=documentDataUri}}

Please perform the following actions:
1.  **Annotate Clauses**: Identify and summarize the key clauses in the document. Focus on clauses related to liability, termination, payment terms, and intellectual property.
2.  **Suggest Redline Edits**: For each clause you identify as potentially problematic or ambiguous, suggest specific redline edits. Your suggestions should be clear, concise, and aimed at improving the clarity and fairness of the document.
3.  **Find Matching Precedent**: For each suggested edit, provide relevant legal precedents or statutory provisions that support your recommendation. Cite sources where possible.

Return your entire analysis as a single JSON object with the keys "annotatedClauses", "suggestedEdits", and "matchingPrecedent". Do not include any other text or formatting in your response.

**Disclaimer**: The analysis provided is for informational purposes only and does not constitute legal advice. It is an automated review and may contain errors or omissions. Always consult with a qualified legal professional for advice on your specific situation. LegalAI is not liable for any actions taken based on this analysis.
`,
});

const analyzeDocumentAndSuggestEditsFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentAndSuggestEditsFlow',
    inputSchema: AnalyzeDocumentAndSuggestEditsInputSchema,
    outputSchema: AnalyzeDocumentAndSuggestEditsOutputSchema,
  },
  async input => {
    if (!input.documentDataUri) {
        throw new Error('A document must be provided for analysis.');
    }
    const {output} = await analyzeDocumentAndSuggestEditsPrompt(input);
    if (!output) {
        throw new Error('The model did not return a valid analysis.');
    }
    return {
        analysisResults: JSON.stringify(output.analysisResults),
    };
  }
);
