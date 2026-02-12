import React from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuthStore } from '../../store/auth.store';

export const AuthLayout: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const routerState = useRouterState();

  if (!user) {
    // In a real app we would redirect; for now simple guard.
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-600 px-2 py-1 text-xs font-semibold text-white">
              KrishiConnect
            </span>
            {user.expert?.isVerified && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                Verified Expert
              </span>
            )}
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-primary-700">
              Feed
            </Link>
            <Link to="/qa" className="hover:text-primary-700">
              Q&A
            </Link>
            <Link to="/market" className="hover:text-primary-700">
              Market
            </Link>
            <Link to="/weather" className="hover:text-primary-700">
              Weather
            </Link>
            <Link to="/chat" className="hover:text-primary-700">
              Chat
            </Link>
            <Link to="/notifications" className="hover:text-primary-700">
              Notifications
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
};

