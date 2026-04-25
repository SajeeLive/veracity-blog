import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAppStore } from "@/store/appStore";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  return (
    <div className="min-h-screen bg-background font-mono text-foreground selection:bg-primary-container selection:text-white">
      {/* TopAppBar */}
      <header className="bg-[#F5F5DC] text-[#36454F] font-serif font-bold tracking-tighter w-full top-0 border-b-2 border-[#36454F] border-dashed shadow-[4px_4px_0px_0px_rgba(54,69,79,1)] z-50 sticky">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-3xl font-black italic tracking-widest uppercase text-[#36454F] no-underline">
              The Ledger
            </Link>
          </div>

          {/* Hand-drawn Search Bar */}
          <div className="hidden md:flex relative group w-64 lg:w-96">
            <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
            <div className="relative flex items-center w-full bg-white sketchy-border px-3 py-1">
              <span className="material-symbols-outlined text-primary-container mr-2" data-icon="search">search</span>
              <input 
                className="w-full bg-transparent border-none outline-none focus:ring-0 font-typewriter text-sm placeholder:text-outline/50 p-0" 
                placeholder="Search the archives..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Bottom Search Bar (Visible on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 p-4 bg-[#F5F5DC] border-t-2 border-[#36454F]">
        <div className="relative group w-full">
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative flex items-center w-full bg-white sketchy-border px-3 py-2">
            <span className="material-symbols-outlined text-primary-container mr-2" data-icon="search">search</span>
            <input 
              className="w-full bg-transparent border-none outline-none focus:ring-0 font-typewriter text-sm placeholder:text-outline/50 p-0" 
              placeholder="Search the archives..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>
    <TanStackRouterDevtools />

    </div>
  );
}

