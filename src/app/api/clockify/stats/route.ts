import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a placeholder implementation
    // In a real implementation, this would fetch actual Clockify statistics

    // Mock data for demonstration
    const mockStats = {
      activeTimers: 0,
      weekHours: 42.5,
      recentEntries: [
        {
          type: 'time',
          title: 'Timer Started',
          description: 'Development work on AI Assistant project',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          source: 'Clockify'
        },
        {
          type: 'time',
          title: 'Timer Stopped',
          description: '2h 15m logged for code review',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          source: 'Clockify'
        }
      ]
    };

    return NextResponse.json(mockStats);

  } catch (error) {
    console.error('Clockify Stats API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch Clockify statistics' },
      { status: 500 }
    );
  }
}