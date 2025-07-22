import { convertToHtml } from '@/ai/flows/html-converter-flow';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid input text provided.' }, { status: 400 });
    }

    const result = await convertToHtml({ articleText: text });
    
    return NextResponse.json({ success: true, html: result.htmlContent });

  } catch (error: any) {
    console.error('HTML conversion failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
