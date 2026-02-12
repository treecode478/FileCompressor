import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  role: 'farmer' | 'expert' | 'admin';
  avatarUrl?: string;
  expert?: { isVerified: boolean };
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (payload: { user: User; accessToken: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: ({ user, accessToken }) => set({ user, accessToken }),
  clearAuth: () => set({ user: null, accessToken: null })
}));

