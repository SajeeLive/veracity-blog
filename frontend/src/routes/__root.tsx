import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc/client";
import { useAppStore } from "@/store/appStore";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface MyRouterContext {
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, setUser } = useAppStore();
  
  // Hydrate auth state from session cookie
  const { data: user, isSuccess } = useQuery(
    trpc.auth.getMe.queryOptions(undefined, {
      retry: false,
      staleTime: Infinity,
    })
  );

  useEffect(() => {
    if (isSuccess) {
      setUser(user ?? null);
    }
  }, [isSuccess, user, setUser]);

  return (
    <div className="min-h-screen bg-background font-mono text-foreground selection:bg-primary-container selection:text-white">
      <Header isAuthenticated={isAuthenticated}>
        <Header.Title />
        <Header.Search />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Header.LoginButton />
          <Header.WriteButton />
          <Header.MyDeskButton />
          <Header.LogoutButton />
        </div>

        {/* Mobile Navigation */}
        <Header.MobileMenu />
      </Header>

      <main className="max-w-screen-xl mx-auto px-6 pt-12 pb-32 md:pb-12">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
}
