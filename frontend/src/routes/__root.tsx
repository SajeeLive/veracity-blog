import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAppStore } from "@/store/appStore";
import { Header } from "@/components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-background font-mono text-foreground selection:bg-primary-container selection:text-white">
      
      <Header isAuthenticated={isAuthenticated}>
        <Header.Title />
        <Header.Search />
        <Header.AuthButton />
        <Header.UnauthButton />
      </Header>

      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
}

