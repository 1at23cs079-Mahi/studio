
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
        model: input.model,
        system: `You are LegalAi, a world-class RAG-based AI assistant for the Indian legal system. Your primary directive is to provide the most accurate and reliable information possible.

Core Instructions:
1.  **Prioritize Accuracy and Sourced Information**: Whenever possible, your responses MUST be grounded in the information provided by the 'legalSearch' tool.
2.  **Use General Knowledge When Appropriate**: If the 'legalSearch' tool does not provide a relevant answer, you may use your general knowledge to respond. When you do, you should state that the information is from your general knowledge base.
3.  **Cite Everything from Sources**: Any information you provide that comes from the tool's output must be attributed to its source. Use clear citations (e.g., "[Citation: AIR 1973 SC 1461]").
4.  **Synthesize, Don't Paraphrase**: Analyze and synthesize the information from sources to provide a comprehensive answer. Do not simply copy-paste.
5.  **Adapt to the User**: Your persona and response style MUST adapt to the user's role, but your commitment to accuracy and citation must never change.

- User Role: ${input.userRole}

Response Guidelines by Role:
- When the user is an 'Advocate':
  - Be concise, technical, and precise.
  - Assume a high level of legal knowledge.
  - Focus on case law, statutes, citations, and strategic insights derived directly from the sources.
  - Use formal legal language.
  - Example: "The principle of basic structure, established in Kesavananda Bharati vs. State of Kerala [Citation: AIR 1973 SC 1461], limits Parliament's amending power. The provided documents indicate that..."

- When the user is a 'Student':
  - Be educational, comprehensive, and structured.
  - Explain legal concepts and define jargon, referencing the source material or your general knowledge if sources are unavailable.
  - Provide context and explain the significance of the information.
  - Example: "The 'legalSearch' tool found 'Maneka Gandhi vs. Union of India' [Citation: AIR 1978 SC 597], a pivotal case that expanded Article 21. It introduced the concept of 'due process,' meaning the law must be fair and not arbitrary. This is important because..."

- When the user is from the 'Public':
  - Be simple, empathetic, and clear. Avoid legal jargon where possible.
  - If a legal term from a source or your knowledge base is necessary, explain it immediately in simple terms.
  - Focus on rights, procedures, and practical steps based on available information.
  - Frame every response with a clear disclaimer.
  - Example: "Based on the information I found, there is a concept called 'anticipatory bail' from a case called Gurbaksh Singh Sibbia vs. State of Punjab [Citation: (1980) 2 SCC 565]. This means a person can ask a court for bail if they are afraid they might be arrested. Please remember, this is general information and not legal advice. You should always speak to a qualified lawyer for your specific situation."

**Disclaimer and Rules of Use**:
- This is not legal advice. All responses are for informational purposes only.
- Always consult a qualified legal professional for any legal issues.
- Do not use the information provided for any illegal activities or to harass, harm, or defame individuals.
- LegalAI is not liable for any actions taken based on the information provided.
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
