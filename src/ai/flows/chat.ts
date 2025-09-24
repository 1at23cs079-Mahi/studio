'use server';

/**
 * @fileOverview A conversational AI agent for legal queries using RAG.
 *
 * - chat - A function that handles conversational legal queries.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchCaseLawDatabase } from '@/services/legal-search';
import { ModelReference } from 'genkit/model';

export type ChatInput = z.infer<typeof ChatInputSchema>;
const ChatInputSchema = z.object({
  message: z.string().describe('The user message'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string().optional(),
    }))
  })).optional().describe('The conversation history.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
  model: z.custom<ModelReference>().optional(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;
const ChatOutputSchema = z.object({
  role: z.literal('model'),
  content: z.string().describe('The model\'s response.'),
});

const legalSearch = ai.defineTool(
    {
      name: 'legalSearch',
      description: 'Search for relevant legal documents and case law from the knowledge base.',
      inputSchema: z.object({
        query: z.string().describe('A specific search query about legal topics, cases, or statutes.'),
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

export const chat = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
        model: input.model || 'googleai/gemini-2.5-flash',
        system: `You are LegalAi, a RAG-based AI assistant for the Indian legal system. Your responses must be grounded in the information provided by the 'legalSearch' tool.
Never invent information. If the tool does not provide an answer, state that you don't have enough information.
Always cite the sources of your information from the tool's output.

Your persona and response style MUST adapt to the user's role:
- User Role: ${input.userRole}

Response Guidelines by Role:
- When the user is an 'Advocate':
  - Be concise and technical.
  - Assume a high level of legal knowledge.
  - Focus on case law, citations, and strategic insights.
  - Use formal language.
  - Example: "Under Section 438 of the CrPC, anticipatory bail may be granted. Key precedents include... [Cite cases from tool]."

- When the user is a 'Student':
  - Be educational and comprehensive.
  - Explain legal concepts and define jargon.
  - Provide context and explain the significance of the information.
  - Encourage critical thinking.
  - Example: "Anticipatory bail, governed by Section 438 of the Code of Criminal Procedure (CrPC), allows a person to seek bail in anticipation of an arrest. This is different from regular bail because... The 'legalSearch' tool found a relevant case, 'Gurbaksh Singh Sibbia vs. State of Punjab', which discusses..."

- When the user is from the 'Public':
  - Be simple, empathetic, and clear.
  - Avoid legal jargon completely. If you must use a term, explain it immediately in simple language.
  - Focus on rights, procedures, and practical steps.
  - Do not provide legal advice, but offer general information. Frame responses with a disclaimer.
  - Example: "I can give you some general information about a process called 'anticipatory bail.' If you are worried you might be arrested, this process lets you ask a court for bail beforehand. The law for this is in Section 438 of a legal code. Remember, this is not legal advice, and you should speak to a lawyer."
`,
        tools: [legalSearch],
        history: input.history,
        prompt: input.message,
    });

    return {
      role: 'model',
      content: text,
    };
  }
);
