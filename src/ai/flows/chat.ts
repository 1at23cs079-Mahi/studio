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
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;
const ChatOutputSchema = z.object({
  role: z.literal('model'),
  content: z.string().describe('The model\'s response.'),
});

const legalSearch = ai.defineTool(
    {
      name: 'legalSearch',
      description: 'Search for relevant legal documents and case law.',
      inputSchema: z.object({
        query: z.string(),
      }),
      outputSchema: z.object({
        results: z.array(z.object({
            source: z.string().describe('The document source.'),
            content: z.string().describe('The document content.'),
        })),
      }),
    },
    async (input) => {
        // In a real RAG system, you would use the input.query to search
        // a vector database (e.g., Chroma, Pinecone) or a search engine.
        // For this prototype, we'll return a fixed set of simulated results
        // to demonstrate the RAG flow.
      return {
        results: [
            { source: 'Case Law 1', content: 'Details about anticipatory bail under Section 438 of the CrPC.' },
            { source: 'Statute 2', content: 'The Indian Penal Code provides definitions and punishments for various offenses.' },
        ]
      };
    }
);

const chatPrompt = ai.definePrompt({
    name: 'ragChatPrompt',
    tools: [legalSearch],
    system: `You are LegalAi, a RAG-based AI assistant. Your responses must be grounded in the information provided by the 'legalSearch' tool.
    Never invent information. If the tool does not provide an answer, state that you don't have enough information.
    Always cite the sources of your information from the tool's output.
    User role: {{{userRole}}}
    `,
});


export const chat = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: {
            ...chatPrompt,
            messages: [
                ...(input.history || []),
                { role: 'user', content: [{ text: input.message }] },
            ]
        },
    });

    return {
      role: 'model',
      content: text,
    };
  }
);
