
'use server';

/**
 * @fileOverview An AI agent for explaining legal terms.
 *
 * - explainLegalTerm - A function that handles the term explanation process.
 * - ExplainLegalTermInput - The input type for the explainLegalTerm function.
 * - ExplainLegalTermOutput - The return type for the explainLegalTerm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLegalTermInputSchema = z.object({
  term: z.string().describe('The legal term to explain.'),
});
export type ExplainLegalTermInput = z.infer<typeof ExplainLegalTermInputSchema>;

const ExplainLegalTermOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the legal term.'),
});
export type ExplainLegalTermOutput = z.infer<typeof ExplainLegalTermOutputSchema>;

export async function explainLegalTerm(input: ExplainLegalTermInput): Promise<ExplainLegalTermOutput> {
  return explainLegalTermFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLegalTermPrompt',
  input: {schema: ExplainLegalTermInputSchema},
  output: {schema: ExplainLegalTermOutputSchema},
  prompt: `You are LegalAi, an AI assistant specialized in explaining complex legal terms in a simple and easy-to-understand manner for the Indian legal system.

Term to Explain: {{{term}}}

Instructions:
1.  Provide a clear and concise definition of the term.
2.  Use a simple analogy or a real-world example to illustrate the concept.
3.  Mention its significance or context in Indian law if applicable.
4.  Avoid overly technical jargon in the main explanation.
5.  Structure the response for clarity. Start with the definition, then the example, then the significance.

Example Response for "Res Judicata":

**Definition:** "Res Judicata" is a legal principle that means "a matter already decided." It prevents the same case between the same parties from being tried again in court once a final judgment has been made.

**Example:** Imagine two neighbors, Ram and Shyam, have a dispute over a boundary wall, and the court rules in favor of Ram. If Shyam tries to sue Ram again for the exact same boundary wall issue, the court will dismiss the case based on Res Judicata, because the matter is already settled.

**Significance:** This principle is crucial for ensuring the finality of court decisions, preventing endless litigation, and saving the court's time and resources.
  `,
});

const explainLegalTermFlow = ai.defineFlow(
  {
    name: 'explainLegalTermFlow',
    inputSchema: ExplainLegalTermInputSchema,
    outputSchema: ExplainLegalTermOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
