import { createRootRouteWithContext, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "@/components/Header";

interface MyRouterContext {
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated } = Route.useRouteContext();
  const location = useLocation();
  const showSearch = !location.pathname.startsWith("/blog/");

  return (
    <div className="min-h-screen bg-background font-mono text-foreground selection:bg-primary-container selection:text-white">
      <Header isAuthenticated={isAuthenticated}>
        <Header.Title />
        {showSearch && <Header.Search />}
        <Header.AuthButton />
        <Header.UnauthButton />
      </Header>

      <main className="max-w-screen-xl mx-auto px-6 pt-12 pb-32 md:pb-12">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
}
