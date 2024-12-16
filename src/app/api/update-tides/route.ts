import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { TideInfo } from '@/types/models/beach';

function getTodayTides(): Record<string, TideInfo[]> {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    "Playa Guapil": [
      { time: `${today}T06:30:00-06:00`, type: 'LOW' as const, height: 0.2 },
      { time: `${today}T12:45:00-06:00`, type: 'HIGH' as const, height: 2.1 },
      { time: `${today}T18:55:00-06:00`, type: 'LOW' as const, height: 0.3 },
    ],
    "Playa Ventanas": [
      { time: `${today}T06:45:00-06:00`, type: 'LOW' as const, height: 0.2 },
      { time: `${today}T13:00:00-06:00`, type: 'HIGH' as const, height: 2.2 },
      { time: `${today}T19:10:00-06:00`, type: 'LOW' as const, height: 0.3 },
    ]
  };
}

export async function GET() {
  try {
    const tideData = getTodayTides();
    await kv.set('tide_data', tideData);
    await kv.set('last_updated', new Date().toISOString());
    
    return NextResponse.json({ 
      success: true,
      message: 'Tide data updated successfully'
    });
  } catch (error) {
    console.error('Failed to update tides:', error);
    return NextResponse.json(
      { error: 'Failed to update tides' }, 
      { status: 500 }
    );
  }
}
