import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const TIDE_DATA = {
  "Playa Guapil": [
    { time: "6:30", type: "LOW", height: 0.2 },
    { time: "12:45", type: "HIGH", height: 2.1 },
    { time: "18:55", type: "LOW", height: 0.3 },
  ],
  "Playa Ventanas": [
    { time: "6:45", type: "LOW", height: 0.2 },
    { time: "13:00", type: "HIGH", height: 2.2 },
    { time: "19:10", type: "LOW", height: 0.3 },
  ]
};

export async function GET() {
  try {
    // Store the tide data in Vercel KV
    await kv.set('tide_data', TIDE_DATA);
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
