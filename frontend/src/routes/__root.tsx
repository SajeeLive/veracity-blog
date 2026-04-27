import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc/client";
import { useAppStore, AppState } from "@/store/appStore";
import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext extends AppState {
  trpc: typeof trpc;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated } = useAppStore();

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

      <Toaster />
      <TanStackRouterDevtools />
    </div>
  );
}
