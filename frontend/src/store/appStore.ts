import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  setDebouncedSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  isAuthenticated: boolean;
  user: { id: string; handle: string } | null;
  setUser: (user: { id: string; handle: string } | null) => void;
  login: (user: { id: string; handle: string }) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  debouncedSearchQuery: '',
  setDebouncedSearchQuery: (query) => set({ debouncedSearchQuery: query }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
