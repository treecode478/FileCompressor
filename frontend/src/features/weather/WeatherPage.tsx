import React from 'react';

export const WeatherPage: React.FC = () => {
  return (
    <div className="kc-card w-full p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Weather</h2>
      <p className="text-xs text-slate-500">
        Use /weather/forecast with lat/lon (from browser geolocation) to show 7-day forecast and
        severe alerts, with simple icons and color coding.
      </p>
    </div>
  );
};

