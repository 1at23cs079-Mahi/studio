
'use server';

/**
 * @fileOverview An AI agent for drafting legal petitions.
 *
 * - draftLegalPetition - A function that handles the petition drafting process.
 * - DraftLegalPetitionInput - The input type for the draftLegalPetition function.
 * - DraftLegalPetitionOutput - The return type for the draftLegalPetition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftLegalPetitionInputSchema = z.object({
  query: z.string().describe('The details of the legal petition to draft.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
});
export type DraftLegalPetitionInput = z.infer<typeof DraftLegalPetitionInputSchema>;

const DraftLegalPetitionOutputSchema = z.object({
  draft: z.string().describe('The draft of the legal petition.'),
  citations: z.array(z.string()).describe('Citations for the legal petition.'),
});
export type DraftLegalPetitionOutput = z.infer<typeof DraftLegalPetitionOutputSchema>;

export async function draftLegalPetition(input: DraftLegalPetitionInput): Promise<DraftLegalPetitionOutput> {
  return draftLegalPetitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftLegalPetitionPrompt',
  input: {schema: DraftLegalPetitionInputSchema},
  output: {schema: DraftLegalPetitionOutputSchema},
  prompt: `You are LegalAi, an AI assistant specialized in drafting legal petitions for the Indian legal system.

As LegalAi, you will draft a legal petition based on the user's request. You must follow the Indian legal hierarchy and cite all sources accurately.
Your draft must be tailored to the user's role, adjusting the level of detail and complexity accordingly.

User Role: {{{userRole}}}

Drafting Request: {{{query}}}

Instructions:
1.  Based on the drafting request, identify relevant statutes and legal precedents.
2.  Draft the legal petition. Include placeholders for case-specific details (e.g., "[Client's Name]", "[Address]").
3.  Provide accurate citations for all legal assertions.
4.  **Role-Based Customization**:
    - For an 'Advocate', the draft should be formal, comprehensive, and ready for court filing, with detailed legal arguments.
    - For a 'Student', the draft should be well-structured with clear sections and annotations explaining the purpose of each clause, serving as a learning tool.
    - For a 'Public' user, the draft should be a simplified version or a pro-forma template, with clear explanations for each section and what information is needed. It should be framed as an informational guide, not a ready-to-file document.
  `,
});

const draftLegalPetitionFlow = ai.defineFlow(
  {
    name: 'draftLegalPetitionFlow',
    inputSchema: DraftLegalPetitionInputSchema,
    outputSchema: DraftLegalPetitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
