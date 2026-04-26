import { ReactNode, createContext, useContext, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAppStore } from "@/store/appStore";

// --- Context ---
interface HeaderContextType {
  isAuthenticated: boolean;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("Header components must be used within a Header");
  }
  return context;
}

// --- Types ---
interface HeaderProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

interface HeaderTitleProps {
  text?: string;
}

// --- Components ---

function HeaderRoot({ children, isAuthenticated }: HeaderProps) {
  return (
    <HeaderContext.Provider value={{ isAuthenticated }}>
      <header className="bg-[#F5F5DC] text-[#36454F] font-serif font-bold tracking-tighter w-full top-0 border-b-2 border-[#36454F] border-dashed shadow-[4px_4px_0px_0px_rgba(54,69,79,1)] z-50 sticky">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </header>
    </HeaderContext.Provider>
  );
}

function HeaderTitle({ text = "The Ledger" }: HeaderTitleProps) {
  return (
    <div className="flex items-center gap-4">
      <Link to="/" className="text-3xl font-black italic tracking-widest uppercase text-[#36454F] no-underline">
        {text}
      </Link>
    </div>
  );
}

function HeaderSearch() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setDebouncedSearchQuery = useAppStore((state) => state.setDebouncedSearchQuery);
  const isSearching = useAppStore((state) => state.isSearching);
  const setIsSearching = useAppStore((state) => state.setIsSearching);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, setDebouncedSearchQuery, setIsSearching]);

  const SearchInput = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="relative group w-full">
      <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
      <div className={`relative flex items-center w-full bg-white sketchy-border px-3 ${mobile ? 'py-2' : 'py-1'}`}>
        {isSearching ? (
          <span className="material-symbols-outlined text-primary-container mr-2 animate-spin text-sm" data-icon="progress_activity">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-primary-container mr-2" data-icon="search">search</span>
        )}
        <input 
          className="w-full bg-transparent border-none outline-none focus:ring-0 font-typewriter text-sm placeholder:text-outline/50 p-0" 
          placeholder="Search the archives..." 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Search (in header) */}
      <div className="hidden md:flex relative group w-64 lg:w-96">
        <SearchInput />
      </div>

      {/* Mobile Search (fixed bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 p-4 bg-[#F5F5DC] border-t-2 border-[#36454F]">
        <SearchInput mobile />
      </nav>
    </>
  );
}

function HeaderAuthButton() {
  const { isAuthenticated } = useHeaderContext();
  
  if (isAuthenticated) return null;

  return (
    <Link to="/" className="stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline">
      Sign In
    </Link>
  );
}

function HeaderUnauthButton() {
  const { isAuthenticated } = useHeaderContext();
  const logout = useAppStore((state) => state.logout);

  if (!isAuthenticated) return null;

  return (
    <button onClick={logout} className="stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center border-none">
      Logout
    </button>
  );
}

// --- Compound Assignment ---
export const Header = Object.assign(HeaderRoot, {
  Title: HeaderTitle,
  Search: HeaderSearch,
  AuthButton: HeaderAuthButton,
  UnauthButton: HeaderUnauthButton,
});