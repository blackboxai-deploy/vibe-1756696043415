import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai/client';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai/prompts';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Add system prompt as first message
    const systemMessage = {
      role: 'system',
      content: DEFAULT_SYSTEM_PROMPT
    };

    const allMessages = [systemMessage, ...messages];

    // Get AI response
    const response = await aiClient.chatCompletion(allMessages);

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Chat API is running',
    model: 'openrouter/claude-sonnet-4',
    timestamp: new Date().toISOString()
  });
}