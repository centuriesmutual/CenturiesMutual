'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      // Get current Central Time
      const centralTime = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"}));
      setTime(centralTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null; // Return null on first render to prevent hydration mismatch
  }

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes / 2); // 360 / 12 = 30 degrees per hour
  const minuteDegrees = minutes * 6; // 360 / 60 = 6 degrees per minute
  const secondDegrees = seconds * 6; // 360 / 60 = 6 degrees per second

  return (
    <div className="relative w-12 h-12">
      {/* Clock Face */}
      <div className="absolute w-full h-full rounded-full border-2 border-blue-600 bg-white">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-1.5 bg-blue-600"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '50% 50%',
              left: '50%',
              top: '0',
            }}
          />
        ))}
        
        {/* Center Point */}
        <div className="absolute w-2 h-2 bg-blue-600 rounded-full" style={{ 
          left: 'calc(50% - 4px)', 
          top: 'calc(50% - 4px)',
          zIndex: 20 
        }} />

        {/* Hour Hand */}
        <div
          className="absolute w-1 h-3 bg-blue-800 rounded-full"
          style={{
            left: 'calc(50% - 2px)',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${hourDegrees}deg)`,
            zIndex: 10
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-0.5 h-4 bg-blue-600 rounded-full"
          style={{
            left: 'calc(50% - 1px)',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${minuteDegrees}deg)`,
            zIndex: 11
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-5 bg-blue-400 rounded-full transition-transform duration-100"
          style={{
            left: 'calc(50% - 1px)',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${secondDegrees}deg)`,
            zIndex: 12
          }}
        />
      </div>
    </div>
  );
} 