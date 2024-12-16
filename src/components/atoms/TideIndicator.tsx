import { TideInfo } from '@/types/models/beach';

interface TideIndicatorProps {
  tide: TideInfo;
  label: string;
}

export function TideIndicator({ tide, label }: TideIndicatorProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
      <span className="text-sm font-medium text-gray-600 mb-2">{label}</span>
      <span className="text-3xl font-bold text-blue-600">{tide.height.toFixed(1)}m</span>
      <span className="text-lg text-gray-700 mt-1">
        {new Date(tide.time).toLocaleTimeString([], { timeStyle: 'short' })}
      </span>
      <span className={`text-sm font-medium mt-2 px-3 py-1 rounded-full ${
        tide.type === 'HIGH' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {tide.type}
      </span>
    </div>
  );
}
