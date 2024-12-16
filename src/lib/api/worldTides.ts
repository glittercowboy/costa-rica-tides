import { Beach, TideInfo } from '@/types/models/beach';

const WORLDTIDES_API_URL = 'https://www.worldtides.info/api/v3';

interface WorldTidesResponse {
  status: number;
  extremes: Array<{
    date: string;
    height: number;
    type: 'High' | 'Low';
  }>;
}

export async function fetchTideData(beach: Beach): Promise<{
  currentTide: TideInfo;
  nextTide: TideInfo;
}> {
  const now = new Date();
  const end = new Date(now);
  end.setHours(end.getHours() + 12); // Get 12 hours of predictions

  const params = new URLSearchParams({
    heights: 'false',
    extremes: 'true',
    datum: 'LAT', // Lowest Astronomical Tide
    start: Math.floor(now.getTime() / 1000).toString(),
    end: Math.floor(end.getTime() / 1000).toString(),
    lat: beach.latitude.toString(),
    lon: beach.longitude.toString(),
    key: process.env.WORLDTIDES_API_KEY || '',
  });

  try {
    const response = await fetch(`${WORLDTIDES_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: WorldTidesResponse = await response.json();
    
    if (data.status !== 200 || !data.extremes || data.extremes.length === 0) {
      throw new Error('Invalid response from WorldTides API');
    }

    // Find current and next tide
    const currentTide = data.extremes[0];
    const nextTide = data.extremes[1] || currentTide;

    return {
      currentTide: {
        time: currentTide.date,
        height: currentTide.height,
        type: currentTide.type.toUpperCase() as 'HIGH' | 'LOW',
      },
      nextTide: {
        time: nextTide.date,
        height: nextTide.height,
        type: nextTide.type.toUpperCase() as 'HIGH' | 'LOW',
      },
    };
  } catch (error) {
    console.error('Error fetching tide data:', error);
    throw new Error('Failed to fetch tide data');
  }
}
