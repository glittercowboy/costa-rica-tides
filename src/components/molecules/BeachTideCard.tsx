import { TideInfo } from '@/types/models/beach';

interface BeachTideCardProps {
  beach: string;
  tides: TideInfo[];
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
            {tide.type} TIDE ({tide.height}m)
          </span>
        </div>
      </div>
    </div>
  );
}

export function BeachTideCard({ beach, tides }: BeachTideCardProps) {
  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">{beach}</h2>
      <div className="space-y-3">
        {tides.map((tide, index) => (
          <TideRow key={index} tide={tide} />
        ))}
      </div>
    </div>
  );
}
