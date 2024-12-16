'use client';

import { BeachTideCard } from '@/components/molecules/BeachTideCard';
import { BEACHES } from '@/lib/constants/beaches';
import { BeachTideData } from '@/types/models/beach';
import { fetchTideData } from '@/lib/api/tideForecast';
import { useEffect, useState } from 'react';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function Home() {
  const [tideData, setTideData] = useState<BeachTideData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTideData() {
      try {
        const today = formatDate(new Date());
        const promises = BEACHES.map(beach => fetchTideData(beach, today));
        const data = await Promise.all(promises);
        setTideData(data);
      } catch (error) {
        console.error('Error loading tide data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTideData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-blue-900 text-center">
          Costa Rica Tide Times
        </h1>
        
        {loading ? (
          <div className="text-center text-gray-600">Loading tide data...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tideData.map((data) => (
              <BeachTideCard key={data.beach.name} data={data} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
