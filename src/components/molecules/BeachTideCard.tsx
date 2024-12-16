import { BeachTideData, TideInfo } from '@/types/models/beach';

interface BeachTideCardProps {
  data: BeachTideData;
}

function TideRow({ tide }: { tide: TideInfo }) {
  const time = new Date(tide.time).toLocaleTimeString([], { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{time}</span>
          <span className={`text-sm font-medium ${
            tide.type === 'HIGH' ? 'text-blue-600' : 'text-amber-600'
          }`}>
            {tide.type} TIDE
          </span>
        </div>
      </div>
      <div>
        <span className="text-lg font-bold">{tide.height.toFixed(1)}m</span>
      </div>
    </div>
  );
}

export function BeachTideCard({ data }: BeachTideCardProps) {
  // Sort tides by time
  const sortedTides = [...data.tides].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return (
    <div className="w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 text-center">
        <h2 className="text-2xl font-bold text-white">{data.beach.name}</h2>
      </div>
      <div className="p-6 space-y-3 bg-gradient-to-b from-white/10 to-white/20">
        {sortedTides.map((tide, index) => (
          <TideRow key={index} tide={tide} />
        ))}
      </div>
    </div>
  );
}
