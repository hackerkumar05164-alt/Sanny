import React from 'react';
import { ConnectionState, AtmosphereTheme } from '../types';

interface WaveformBarProps {
  frequencies: Uint8Array;
  status: ConnectionState;
  atmosphere: AtmosphereTheme;
}

export const WaveformBar: React.FC<WaveformBarProps> = ({
  frequencies,
  status,
  atmosphere,
}) => {
  const isConnected = status !== 'disconnected';

  const barColor = React.useMemo(() => {
    switch (atmosphere) {
      case 'electric-violet':
        return '#8b5cf6';
      case 'neon-cyan':
        return '#06b6d4';
      case 'midnight-matrix':
        return '#10b981';
      case 'sunset-flare':
        return '#f97316';
      case 'cyber-rose':
      default:
        return '#f43f5e';
    }
  }, [atmosphere]);

  // Sample 32 bars
  const bars = React.useMemo(() => {
    const sampleCount = 32;
    const result: number[] = [];
    const step = Math.max(1, Math.floor(frequencies.length / sampleCount));
    for (let i = 0; i < sampleCount; i++) {
      const val = frequencies[i * step] || 0;
      result.push(val / 255);
    }
    return result;
  }, [frequencies]);

  return (
    <div
      id="waveform-bar-footer"
      className="w-full max-w-2xl mx-auto px-6 py-2 flex items-end justify-center gap-1 sm:gap-1.5 h-10 z-10 select-none opacity-80"
    >
      {bars.map((normalizedHeight, index) => {
        const heightPx = isConnected
          ? Math.max(3, normalizedHeight * 36)
          : Math.sin(index * 0.4) * 2 + 3;

        return (
          <div
            key={index}
            className="w-1 sm:w-1.5 rounded-full transition-all duration-75"
            style={{
              height: `${heightPx}px`,
              backgroundColor: isConnected ? barColor : '#3f3f46',
              opacity: isConnected ? 0.3 + normalizedHeight * 0.7 : 0.2,
              boxShadow: isConnected && normalizedHeight > 0.3 ? `0 0 6px ${barColor}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
