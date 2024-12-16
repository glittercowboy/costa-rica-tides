'use client';

import { BeachTideCard } from '@/components/molecules/BeachTideCard';
import { BEACHES } from '@/lib/constants/beaches';
import { BeachTideData } from '@/types/models/beach';
import { fetchTideData } from '@/lib/api/tideForecast';
import { useEffect, useState } from 'react';
import { kv } from '@vercel/kv';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default async function Home() {
  const tideData = await kv.get('tide_data') || {};
  const lastUpdated = await kv.get('last_updated');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-blue-900 text-center">
          Costa Rica Tide Times
        </h1>
        
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
