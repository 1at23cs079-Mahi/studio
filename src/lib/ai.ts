import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Google Gemini
const genAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

export type LegalAnalysisRequest = {
  text: string;
  analysisType: 'summary' | 'risk-assessment' | 'clause-extraction' | 'compliance-check';
  jurisdiction?: string;
};

export type LegalAnalysisResponse = {
  analysis: string;
  keyPoints: string[];
  risks?: string[];
  suggestions?: string[];
  confidence: number;
};

export async function analyzeLegalDocument(
  request: LegalAnalysisRequest
): Promise<LegalAnalysisResponse> {
  const { text, analysisType, jurisdiction = 'general' } = request;

  const prompts = {
    summary: `As a legal expert, provide a concise summary of this legal document. Include the main purpose, key parties involved, and important obligations or rights. Format your response with clear sections.`,
    'risk-assessment': `As a legal risk analyst, identify and assess potential risks in this legal document. Categorize risks as high, medium, or low. Provide specific concerns and recommendations.`,
    'clause-extraction': `Extract and list all important clauses from this legal document. Categorize them by type (e.g., termination, liability, confidentiality, payment terms). Explain each clause in simple terms.`,
    'compliance-check': `Review this legal document for compliance issues in ${jurisdiction} jurisdiction. Identify any potentially non-compliant clauses, missing required provisions, or areas that need legal review.`,
  };

  const systemPrompt = prompts[analysisType];
  const userMessage = `Document Text:\n\n${text.substring(0, 10000)}`; // Limit to first 10k chars

  try {
    // Try OpenAI first if available
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const analysis = completion.choices[0]?.message?.content || 'No analysis generated';
      return parseAnalysisResponse(analysis, analysisType);
    }

    // Fallback to Google Gemini if OpenAI is not available
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `${systemPrompt}\n\n${userMessage}`;
      const result = await model.generateContent(prompt);
      const analysis = result.response.text();
      return parseAnalysisResponse(analysis, analysisType);
    }

    throw new Error('No AI service configured. Please set OPENAI_API_KEY or GOOGLE_AI_API_KEY');
  } catch (error: any) {
    console.error('Legal analysis error:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
}

function parseAnalysisResponse(
  analysis: string,
  analysisType: string
): LegalAnalysisResponse {
  // Extract key points (lines starting with - or • or numbers)
  const keyPointsRegex = /(?:^|\n)(?:[-•*]|\d+\.)\s*(.+?)(?=\n|$)/g;
  const keyPointsMatches = [...analysis.matchAll(keyPointsRegex)];
  const keyPoints = keyPointsMatches
    .map((match) => match[1].trim())
    .filter((point) => point.length > 10)
    .slice(0, 5);

  // Extract risks if it's a risk assessment
  const risks =
    analysisType === 'risk-assessment'
      ? keyPoints.filter((point) => /risk|concern|issue|problem/i.test(point))
      : [];

  // Extract suggestions
  const suggestions = keyPoints.filter((point) =>
    /recommend|suggest|should|consider|advise/i.test(point)
  );

  return {
    analysis,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Analysis completed successfully'],
    risks: risks.length > 0 ? risks : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    confidence: keyPoints.length > 0 ? 0.85 : 0.6,
  };
}

export async function generateLegalDocument(
  templateType: string,
  parameters: Record<string, any>
): Promise<string> {
  const prompt = `Generate a professional ${templateType} document with the following details:
${JSON.stringify(parameters, null, 2)}

Format the document properly with:
- Title
- Parties involved
- Effective date
- All necessary clauses
- Signature blocks

Make it legally sound and professionally formatted.`;

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert legal document drafter. Generate clear, professional legal documents.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 3000,
      });

      return completion.choices[0]?.message?.content || 'Failed to generate document';
    }

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    throw new Error('No AI service configured');
  } catch (error: any) {
    console.error('Document generation error:', error);
    throw new Error(`Failed to generate document: ${error.message}`);
  }
}
