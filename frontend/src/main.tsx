import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, queryClient, trpcClient } from "./lib/trpc/client";
import { useAppStore } from "./store/appStore";

import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
    user: null,
    setUser: () => {},
    trpc,
    searchQuery: "",
    setSearchQuery: () => {},
    debouncedSearchQuery: "",
    setDebouncedSearchQuery: () => {},
    isSearching: false,
    setIsSearching: () => {},
    login: () => {},
    logout: () => {},
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const store = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ ...store, trpc }} />
    </QueryClientProvider>
  );
}

// Hydrate the store before rendering the app
const hydrateStore = async () => {
  try {
    const user = await trpcClient.auth.getMe.query();
    useAppStore.getState().setUser(user ?? null);
  } catch {
    useAppStore.getState().setUser(null);
  }
};

hydrateStore().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
