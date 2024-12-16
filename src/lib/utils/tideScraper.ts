import * as cheerio from 'cheerio';
import { TideInfo } from '@/types/models/beach';

const DOMINICAL_URL = 'https://www.tide-forecast.com/locations/Dominical-Costa-Rica/tides/latest';

export async function scrapeTides(): Promise<Record<string, TideInfo[]>> {
  try {
    // Fetch the HTML content
    const response = await fetch(DOMINICAL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tide data: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const tides: TideInfo[] = [];
    
    // Find the tide table
    $('.tide-day').first().find('.tide').each((_, element) => {
      const timeText = $(element).find('.time').text().trim();
      const heightText = $(element).find('.height').text().trim();
      const typeText = $(element).find('.type').text().trim();

      // Parse the time (convert to 24-hour format)
      const [time, period] = timeText.split(' ');
      const [hour, minute] = time.split(':');
      let hour24 = parseInt(hour);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;

      // Create ISO time string for today
      const today = new Date();
      today.setHours(hour24, parseInt(minute), 0);
      
      // Parse height (convert to meters)
      const height = parseFloat(heightText.replace('m', ''));

      // Determine tide type
      const type = typeText.includes('High') ? 'HIGH' as const : 'LOW' as const;

      tides.push({
        time: today.toISOString(),
        height,
        type
      });
    });

    // Adjust times for each beach (Dominical is our reference point)
    return {
      "Playa Guapil": tides.map(tide => ({
        ...tide,
        time: adjustTime(tide.time, -10), // 10 minutes earlier than Dominical
      })),
      "Playa Ventanas": tides.map(tide => ({
        ...tide,
        time: adjustTime(tide.time, -5), // 5 minutes earlier than Dominical
      }))
    };
  } catch (error) {
    console.error('Error scraping tide data:', error);
    throw error;
  }
}

function adjustTime(isoTime: string, minutesOffset: number): string {
  const date = new Date(isoTime);
  date.setMinutes(date.getMinutes() + minutesOffset);
  return date.toISOString();
}
