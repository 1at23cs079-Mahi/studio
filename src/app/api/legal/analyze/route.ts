import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { analyzeLegalDocument } from '@/lib/ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, analysisType, jurisdiction } = body;

    if (!text || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields: text and analysisType' },
        { status: 400 }
      );
    }

    if (!['summary', 'risk-assessment', 'clause-extraction', 'compliance-check'].includes(analysisType)) {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      );
    }

    const analysis = await analyzeLegalDocument({
      text,
      analysisType,
      jurisdiction,
    });

    return NextResponse.json(
      {
        success: true,
        analysis,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Legal analysis API error:', error);
    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
