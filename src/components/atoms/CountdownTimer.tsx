'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTime: string;
}

export function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const target = new Date(targetTime);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Now!');
        return;
      }

      // Convert to hours, minutes
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    }

    // Update immediately
    updateCountdown();

    // Then update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <span className="font-mono text-sm bg-black/10 px-2 py-1 rounded">
      {timeLeft}
    </span>
  );
}
