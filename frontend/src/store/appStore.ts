import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
