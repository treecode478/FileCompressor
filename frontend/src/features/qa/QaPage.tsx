import React from 'react';

export const QaPage: React.FC = () => {
  return (
    <div className="kc-card w-full p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Q&A</h2>
      <p className="text-xs text-slate-500">
        Farmers can ask questions (text/voice), tag experts, and get upvoted answers. This UI will
        call the /qa APIs.
      </p>
    </div>
  );
};

