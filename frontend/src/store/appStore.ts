import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  setDebouncedSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  isAuthenticated: boolean;
  login: () => void;
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
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
