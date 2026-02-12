import React from 'react';

export const FeedPage: React.FC = () => {
  // Placeholder – would call /posts/feed via react-query and render list.
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[2fr,1fr]">
      <section className="space-y-4">
        <div className="kc-card p-4">
          <p className="text-sm font-semibold text-slate-800">Create post</p>
          <p className="mt-2 text-xs text-slate-500">
            Voice-to-text, media upload, and hashtag/mention support will be wired here.
          </p>
        </div>
        <div className="kc-card p-4">
          <p className="text-sm text-slate-700">Your feed will appear here.</p>
        </div>
      </section>
      <aside className="space-y-4">
        <div className="kc-card p-4">
          <p className="text-sm font-semibold text-slate-800">Weather</p>
          <p className="mt-1 text-xs text-slate-500">
            Quick view using /weather/forecast for your location.
          </p>
        </div>
        <div className="kc-card p-4">
          <p className="text-sm font-semibold text-slate-800">Market prices</p>
          <p className="mt-1 text-xs text-slate-500">
            Latest mandi prices by state and crop.
          </p>
        </div>
      </aside>
    </div>
  );
};

