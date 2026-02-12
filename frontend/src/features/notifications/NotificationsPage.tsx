import React from 'react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="kc-card w-full p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Notifications</h2>
      <p className="text-xs text-slate-500">
        Connect to /notifications and real-time notification:new events to show likes, comments,
        messages, weather and market alerts.
      </p>
    </div>
  );
};

