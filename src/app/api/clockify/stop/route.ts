import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { entryId } = await request.json();

    // This is a placeholder implementation
    // In a real implementation, this would:
    // 1. Validate Clockify API key
    // 2. Stop the specified time entry via Clockify API
    // 3. Return the final entry data with total duration

    // Mock response
    return NextResponse.json({
      success: true,
      entryId,
      finalDuration: 3600, // 1 hour in seconds
      message: 'Timer stopped successfully'
    });

  } catch (error) {
    console.error('Clockify Stop Timer API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to stop timer' },
      { status: 500 }
    );
  }
}