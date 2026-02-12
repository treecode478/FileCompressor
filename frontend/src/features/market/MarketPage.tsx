import React from 'react';

export const MarketPage: React.FC = () => {
  return (
    <div className="kc-card w-full p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Mandi prices</h2>
      <p className="text-xs text-slate-500">
        Integrate with /market to filter by state, district, and commodity. Show paginated table for
        latest mandi prices.
      </p>
    </div>
  );
};

