import { kv } from '@vercel/kv';
import { BeachTideCard } from '@/components/molecules/BeachTideCard';
import { TideInfo } from '@/types/models/beach';

// Fallback data for when KV is not available
const fallbackData: Record<string, TideInfo[]> = {
  "Playa Guapil": [
    { time: new Date().toISOString(), type: 'LOW' as const, height: 0.2 },
    { time: new Date().toISOString(), type: 'HIGH' as const, height: 2.1 },
  ],
  "Playa Ventanas": [
    { time: new Date().toISOString(), type: 'LOW' as const, height: 0.2 },
    { time: new Date().toISOString(), type: 'HIGH' as const, height: 2.2 },
  ]
};

export default async function Home() {
  let tideData: Record<string, TideInfo[]>;
  let lastUpdated: string;

  try {
    tideData = await kv.get('tide_data') as Record<string, TideInfo[]>;
    lastUpdated = await kv.get('last_updated') as string;
  } catch (error) {
    console.error('Failed to fetch from KV:', error);
    tideData = fallbackData;
    lastUpdated = new Date().toISOString();
  }

  // If KV returned null or undefined, use fallback data
  if (!tideData) {
    tideData = fallbackData;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Costa Rica Tide Times</h1>
        
        {Object.entries(tideData).map(([beach, tides]) => (
          <BeachTideCard 
            key={beach}
            beach={beach}
            tides={tides}
          />
        ))}

        <div className="text-sm text-gray-500 text-center mt-8">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      </div>
    </main>
  );
}
