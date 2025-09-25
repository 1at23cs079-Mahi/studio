
'use server';

/**
 * @fileOverview A document analysis AI agent that annotates clauses, suggests redline edits,
 * and provides matching precedent for each flagged clause in a legal document using a RAG model.
 *
 * - analyzeDocumentAndSuggestEdits - A function that handles the document analysis process.
 * - AnalyzeDocumentAndSuggestEditsInput - The input type for the analyzeDocumentAndSuggestEdits function.
 * - AnalyzeDocumentAndSuggestEditsOutput - The return type for the analyzeDocumentAndSuggestEdits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchCaseLawDatabase } from '@/services/legal-search';

const AnalyzeDocumentAndSuggestEditsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported file types: PDF, DOCX, TXT."
    ),
  userQuery: z.string().optional().describe('A specific instruction from the user to guide the analysis, including the desired output format (e.g., "summarize in bullet points", "create a markdown table").'),
});
export type AnalyzeDocumentAndSuggestEditsInput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsInputSchema
>;

const AnalysisResultSchema = z.object({
    analysis: z.string().describe("The full analysis of the document, formatted as requested by the user. This should include annotated clauses, suggested edits, and matching precedents all in one structured response."),
});

const AnalyzeDocumentAndSuggestEditsOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe(
      'A JSON string containing the analysis results. The JSON object should have a single key: "analysis".'
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

const legalSearch = ai.defineTool(
    {
      name: 'legalSearch',
      description: 'Search for relevant legal documents and case law from the knowledge base to find precedents.',
      inputSchema: z.object({
        query: z.string().describe('A specific search query about legal topics, cases, or statutes to find supporting precedents.'),
      }),
      outputSchema: z.object({
        results: z.array(z.object({
            source: z.string().describe('The document source or case citation.'),
            content: z.string().describe('The content or summary of the document.'),
        })),
      }),
    },
    async (input) => {
        const searchResults = await searchCaseLawDatabase(input.query);
        return {
            results: searchResults.map(c => ({
                source: c.citation,
                content: c.summary,
            }))
        };
    }
);


const analyzeDocumentAndSuggestEditsPrompt = ai.definePrompt({
  name: 'analyzeDocumentAndSuggestEditsPrompt',
  input: {schema: AnalyzeDocumentAndSuggestEditsInputSchema},
  output: {schema: z.object({ analysisResults: AnalysisResultSchema }) },
  tools: [legalSearch],
  prompt: `You are an expert legal analyst. Your task is to perform a Retrieval-Augmented Generation (RAG) analysis on the provided legal document.

Document to Analyze: {{media url=documentDataUri}}
{{#if userQuery}}
User's Specific Request: "{{{userQuery}}}"
{{/if}}

Please perform the following actions in a two-step process:
1.  **Analyze and Identify**: First, carefully review the document to identify key clauses, potential risks, and areas for improvement. {{#if userQuery}}Prioritize the user's specific request in your analysis.{{else}}Focus on liability, termination, payment terms, and intellectual property.{{/if}}

2.  **Retrieve and Synthesize**: For each clause you identify as potentially problematic or ambiguous, use the 'legalSearch' tool to find relevant legal precedents or statutes from the knowledge base.

3.  **Generate Output**: Based on your analysis and the retrieved information, generate a single, unified analysis that includes:
    - **Annotated Clauses**: A summary of the key clauses identified.
    - **Suggested Redline Edits**: Specific, clear edits for problematic clauses.
    - **Matching Precedent**: The relevant legal precedents retrieved from the 'legalSearch' tool that support your recommendations. Cite the sources.

You MUST intelligently determine the output format from the User's Specific Request.
- If the user asks for a 'table', create a well-structured Markdown table with columns for "Clause", "Issue", "Suggested Edit", and "Supporting Precedent".
- If the user asks for 'bullet points' or a 'summary', use clear headings and nested bullet points for each section (Clauses, Edits, Precedents).
- If the user does not specify a format, provide a detailed, narrative-style report in well-structured paragraphs.

Return your entire analysis as a single JSON object with one key: "analysis". Do not include any other text or formatting in your response.

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
