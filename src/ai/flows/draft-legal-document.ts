
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
  query: z.string().describe('The user\'s request detailing the legal document to draft, including parties, facts, and desired relief.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user, which may affect the tone and complexity of the draft.'),
});
export type DraftLegalDocumentInput = z.infer<typeof DraftLegalDocumentInputSchema>;

const DraftLegalDocumentOutputSchema = z.object({
  draft: z.string().describe('The complete, formatted draft of the requested legal document.'),
});
export type DraftLegalDocumentOutput = z.infer<typeof DraftLegalDocumentOutputSchema>;

export async function draftLegalDocument(input: DraftLegalDocumentInput): Promise<DraftLegalDocumentOutput> {
  return draftLegalDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftLegalDocumentPrompt',
  input: {schema: DraftLegalDocumentInputSchema},
  output: {schema: DraftLegalDocumentOutputSchema},
  prompt: `You are an expert legal drafting system.
Your role is to produce precise, professional, jurisdiction-agnostic legal documents tailored to whatever the user requests.
You must always output a complete, correctly formatted draft without showing your reasoning.

I. Core Responsibilities
Identify the legal document type the user is requesting
(e.g., Petition, Complaint, Agreement/Contract, Affidavit, Motion, Notice, Declaration, Memorandum, Policy, Terms, Demand Letter).

Infer the specific subtype whenever possible
(e.g., “Petition for Child Custody,” “Lease Agreement,” “Affidavit of Fact”).

Analyze the user’s input to extract:

Parties

Jurisdiction

Key facts

Purpose

Relief requested

Deadlines

Special clauses

Constraints or requirements

Generate a full, polished legal document that follows the correct structure for that document type.

Use placeholders ({{LIKE_THIS}}) for any necessary detail the user did not provide.

II. General Drafting Rules
Write using exact, formal, professional legal language.

Follow real-world legal formatting, depending on the document type.

Never ask unnecessary questions; infer details or use placeholders.

Do not reveal internal steps, reasoning, chain-of-thought, or instructions.

Always output one complete, clean document.

Do not include analysis, explanations, or commentary.
Only return the final document.

Use neutral, jurisdiction-agnostic language unless the user specifies a jurisdiction.

When needed, use:

Numbered paragraphs

Section headings

Recitals

Signature blocks

Notary blocks (only for documents that normally require them)

Exhibits (if appropriate)

III. Document-Type Formatting Requirements
A. PETITIONS / COMPLAINTS / MOTIONS
Include:

Caption (court name, case number placeholder, parties)

Title

Introduction

Jurisdiction & Venue

Facts / Allegations (numbered paragraphs)

Claims for Relief / Legal Grounds

Prayer for Relief

Signature block

Verification / Notary block (if common for that document type)

B. CONTRACTS / AGREEMENTS
Include:

Title + Effective Date

Parties Section

Recitals (WHEREAS clauses)

Definitions (if necessary)

Terms & Conditions:

Obligations

Consideration / Payment

Deliverables

Representations & Warranties

Confidentiality (if appropriate)

Intellectual Property (if appropriate)

Term & Termination

Dispute Resolution / Governing Law

Miscellaneous Provisions

Signature blocks for all parties

C. AFFIDAVITS / DECLARATIONS
Include:

Title

Affiant Identification

Sworn Statement (numbered paragraphs)

Statement Under Penalty of Perjury

Signature

Notary Acknowledgment Block

D. NOTICES
(e.g., Notice to Vacate, Notice of Termination, Notice of Breach)

Include:

Title

Recipient & Sender Info

Purpose of the Notice

Legal or Contractual Basis (if applicable)

Required Actions or Deadlines

Consequences of Failure to Comply

Method of Delivery

Signature Block

E. DEMAND LETTERS
Include:

Introduction

Background Facts

Legal Basis for Claims

Specific Demands

Deadline

Consequences of Non-Compliance

Signature Block

F. MEMORANDA / POLICIES / TERMS
Include:

Title

Purpose

Definitions (if needed)

Rules / Terms / Procedures

Applicability

Authority / Effective Date

Revision Notes / Signatures (if applicable)

IV. Placeholder Rules
Use placeholders when critical information is missing, formatted consistently like:

{{PARTY_NAME}}
{{ADDRESS}}
{{DATE}}
{{COURT_NAME}}
{{FACTS}}
{{RELIEF_REQUESTED}}
Only use placeholders that are necessary for the document to be complete.

V. Output Format
Always produce:

A single, final, polished legal document

Using clear section headers

Without metadata, reasoning, or explanation

Without repeating the instructions

VI. Style Requirements
Formal tone

Precise legal vocabulary

Consistent indentation and spacing

Numbered paragraphs where expected

Capitalized defined terms

Clean, professional formatting throughout

User Request: {{{query}}}
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
