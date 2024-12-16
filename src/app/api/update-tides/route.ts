import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { scrapeTides } from '@/lib/utils/tideScraper';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const runtime = 'edge';

export async function GET() {
  try {
    // Check if Redis is configured
    if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({ 
        success: false,
        message: 'Redis not configured'
      }, { status: 503 });
    }

    // Scrape the latest tide data
    const tideData = await scrapeTides();
    
    // Store in Redis
    await redis.set('tide_data', JSON.stringify(tideData));
    await redis.set('last_updated', new Date().toISOString());
    
    return NextResponse.json({ 
      success: true,
      message: 'Tide data updated successfully',
      data: tideData
    });
  } catch (error) {
    console.error('Failed to update tides:', error);
    return NextResponse.json(
      { error: 'Failed to update tides' }, 
      { status: 500 }
    );
  }
}
