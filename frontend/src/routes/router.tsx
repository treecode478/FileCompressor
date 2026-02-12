import {
  Router,
  RouterProvider,
  Route,
  Outlet
} from '@tanstack/react-router';
import React from 'react';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { useAuthStore } from '@store/auth.store';
import { AuthLayout } from '../features/auth/AuthLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { FeedPage } from '../features/feed/FeedPage';
import { QaPage } from '../features/qa/QaPage';
import { MarketPage } from '../features/market/MarketPage';
import { WeatherPage } from '../features/weather/WeatherPage';
import { ChatPage } from '../features/chat/ChatPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';


const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => <Outlet />
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: () => <AuthLayout />
});

const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/login',
  component: () => <LoginPage />
});

const feedRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: () => <FeedPage />
});

const qaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/qa',
  component: () => <QaPage />
});

const marketRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/market',
  component: () => <MarketPage />
});

const weatherRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/weather',
  component: () => <WeatherPage />
});

const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/chat',
  component: () => <ChatPage />
});

const notificationsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/notifications',
  component: () => <NotificationsPage />
});

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([loginRoute]),
  appRoute.addChildren([
    feedRoute,
    qaRoute,
    marketRoute,
    weatherRoute,
    chatRoute,
    notificationsRoute
  ])
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

