import * as cheerio from 'cheerio';
import { TideInfo } from '@/types/models/beach';

const DOMINICAL_URL = 'https://magicseaweed.com/Dominical-Surf-Report/1075/Tide/';

export async function scrapeTides(): Promise<Record<string, TideInfo[]>> {
  try {
    // Fetch the HTML content
    const response = await fetch(DOMINICAL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tide data: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const tides: TideInfo[] = [];
    
    // Find the tide table
    $('.tide-times__list li').each((_, element) => {
      const $element = $(element);
      const timeText = $element.find('.tide-times__time').text().trim();
      const heightText = $element.find('.tide-times__height').text().trim();
      const typeText = $element.find('.tide-times__type').text().trim().toUpperCase();

      // Parse the time
      const [hours, minutes] = timeText.split(':').map(Number);
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);

      // Parse height (convert to meters if in feet)
      let height = parseFloat(heightText);
      if (heightText.includes('ft')) {
        height = height * 0.3048; // Convert feet to meters
      }

      // Determine tide type
      const type = typeText.includes('HIGH') ? 'HIGH' as const : 'LOW' as const;

      tides.push({
        time: today.toISOString(),
        height,
        type
      });
    });

    // Sort tides by time
    tides.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // Adjust times for each beach (Dominical is our reference point)
    return {
      "Playa Guapil": tides.map(tide => ({
        ...tide,
        time: adjustTime(tide.time, -15), // 15 minutes earlier than Dominical
      })),
      "Playa Ventanas": tides.map(tide => ({
        ...tide,
        time: adjustTime(tide.time, -10), // 10 minutes earlier than Dominical
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
