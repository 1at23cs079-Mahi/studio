
'use server';

/**
 * @fileOverview An AI agent for drafting various legal documents.
 *
 * - draftLegalDocument - A function that handles the document drafting process.
 * - DraftLegalDocumentInput - The input type for the draftLegalDocument function.
 * - DraftLegalDocumentOutput - The return type for the draftLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DraftLegalDocumentInputSchema = z.object({
  query: z.string().describe('The details of the legal document to draft, such as petition, agreement, affidavit, etc.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
});
export type DraftLegalDocumentInput = z.infer<typeof DraftLegalDocumentInputSchema>;

const DraftLegalDocumentOutputSchema = z.object({
  draft: z.string().describe('The draft of the legal document, formatted with proper headings, sections, and placeholders for copy-pasting into a document editor.'),
});
export type DraftLegalDocumentOutput = z.infer<typeof DraftLegalDocumentOutputSchema>;

export async function draftLegalDocument(input: DraftLegalDocumentInput): Promise<DraftLegalDocumentOutput> {
  return draftLegalDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftLegalDocumentPrompt',
  input: {schema: DraftLegalDocumentInputSchema},
  output: {schema: DraftLegalDocumentOutputSchema},
  prompt: `You are LegalAi, an expert AI assistant specializing in drafting a wide range of legal documents for the Indian legal system. Your task is to generate a clean, well-formatted, and precise draft based on the user's request.

User Role: {{{userRole}}}

Drafting Request: {{{query}}}

**Core Instructions:**
1.  **Identify Document Type**: First, analyze the user's query to identify the specific type of legal document requested (e.g., Writ Petition, Rental Agreement, Affidavit, Legal Notice, Power of Attorney, etc.).
2.  **Apply Correct Structure**: Based on the identified document type, apply the correct and standard legal structure for that document. For example:
    *   **Petitions/Plaints**: Must include court name, case title, index, list of dates, body with numbered paragraphs, and a prayer clause.
    *   **Agreements**: Must include title, parties, recitals (WHEREAS clauses), operative clauses (NOW, THEREFORE, IT IS HEREBY AGREED AS FOLLOWS), consideration, term, termination, and signature blocks.
    *   **Affidavits**: Must include court/authority name, case title, deponent's details, numbered paragraphs stating facts, and a verification clause.
    *   **Legal Notices**: Must include the advocate's letterhead format, date, reference number, recipient details, and a clear set of demands and consequences.
3.  **Precise Formatting**:
    *   **Alignment**: Use center alignment for main headings of court documents (e.g., "IN THE SUPREME COURT OF INDIA"). Side headings should be left-aligned and in all-caps or bold as appropriate.
    *   **Placeholders**: Use clear, bracketed placeholders for all case-specific details that the user must fill in (e.g., "[Client's Name]", "[Address]", "[Date]", "[Name of Petitioner]", "[Consideration Amount]").
    *   **Numbering**: Use consistent numbering and lettering for paragraphs and clauses (e.g., 1, 2, 3... and (a), (b), (c)...).
4.  **Content Generation**: Generate the core content using formal legal language appropriate for the document type and the user's role.
5.  **Role-Based Customization**:
    *   For an 'Advocate', the draft should be formal, comprehensive, and ready for court filing, with detailed legal arguments and placeholders for evidence.
    *   For a 'Student', the draft should be well-structured with annotations explaining the purpose of each clause, serving as a learning tool.
    *   For a 'Public' user, the draft should be a simplified pro-forma template with very clear explanations for each section and what information is needed.
6.  **DO NOT INCLUDE DISCLAIMERS**: Your entire response must be only the legal draft itself. Do not add any introductory text or concluding remarks. The output must be the raw, formatted document.
  `,
});

const draftLegalDocumentFlow = ai.defineFlow(
  {
    name: 'draftLegalDocumentFlow',
    inputSchema: DraftLegalDocumentInputSchema,
    outputSchema: DraftLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
