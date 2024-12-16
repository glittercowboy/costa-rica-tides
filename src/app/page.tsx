import { kv } from '@vercel/kv';
import BeachTideCard from '@/components/molecules/BeachTideCard';

export default async function Home() {
  const tideData = await kv.get('tide_data') || {};
  const lastUpdated = await kv.get('last_updated');

  return (
    <main className="min-h-screen p-4 md:p-8">
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
          Last updated: {new Date(lastUpdated as string).toLocaleString()}
        </div>
      </div>
    </main>
  );
}
