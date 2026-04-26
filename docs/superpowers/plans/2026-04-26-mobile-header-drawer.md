# Mobile Header Drawer Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a responsive drawer-based navigation for mobile views in the header.

**Architecture:** Encapsulate mobile action buttons inside a Shadcn UI Drawer component that appears only on mobile screens.

**Tech Stack:** React, Tailwind CSS, Shadcn UI (Drawer), TanStack Router.

---

### Task 1: Add HeaderMobileMenu Component

**Files:**
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Import Drawer components and icons**
- [ ] **Step 2: Implement HeaderMobileMenu component**
- [ ] **Step 3: Export HeaderMobileMenu as part of Header compound component**

```tsx
// Inside frontend/src/components/Header.tsx

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

// ... existing code ...

function HeaderMobileMenu() {
  const { isAuthenticated } = useHeaderContext();
  const logout = useAppStore((state) => state.logout);

  return (
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <button className="flex items-center justify-center p-2">
            <span className="material-symbols-outlined text-3xl" data-icon="menu">menu</span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#F5F5DC] border-[#36454F] border-t-4">
          <DrawerHeader>
            <DrawerTitle className="font-serif italic uppercase tracking-widest text-[#36454F]">
              The Ledger
            </DrawerTitle>
            <DrawerDescription className="font-typewriter text-[#36454F]/70">
              Navigation Menu
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-6">
            {!isAuthenticated ? (
              <Link 
                to="/auth/sign-in" 
                className="stamped-ink px-4 py-4 font-typewriter text-lg font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline"
              >
                Log In
              </Link>
            ) : (
              <>
                <Link 
                  to="/my-desk" 
                  className="stamped-ink px-4 py-4 font-typewriter text-lg font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline"
                >
                  My Desk
                </Link>
                <button 
                  onClick={() => {
                    logout();
                  }} 
                  className="stamped-ink px-4 py-4 font-typewriter text-lg font-bold uppercase tracking-widest cursor-pointer inline-block text-center border-none"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="font-typewriter uppercase tracking-widest border-2 border-[#36454F]">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// Update the compound assignment
export const Header = Object.assign(HeaderRoot, {
  Title: HeaderTitle,
  Search: HeaderSearch,
  AuthButton: HeaderAuthButton,
  MyDeskButton: HeaderMyDeskButton,
  UnauthButton: HeaderUnauthButton,
  MobileMenu: HeaderMobileMenu, // Add this
});
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "feat(header): add MobileMenu component using Drawer"
```

---

### Task 2: Integrate MobileMenu into Root Route

**Files:**
- Modify: `frontend/src/routes/__root.tsx`

- [ ] **Step 1: Add Header.MobileMenu and hide desktop buttons on mobile**

```tsx
// Inside frontend/src/routes/__root.tsx

function RootComponent() {
  const { isAuthenticated } = Route.useRouteContext();

  return (
    <div className="min-h-screen bg-background font-mono text-foreground selection:bg-primary-container selection:text-white">
      <Header isAuthenticated={isAuthenticated}>
        <Header.Title />
        <Header.Search />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Header.AuthButton />
          <Header.MyDeskButton />
          <Header.UnauthButton />
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/routes/__root.tsx
git commit -m "feat(layout): integrate Header.MobileMenu into root layout"
```

---

### Task 3: Visual Verification

- [ ] **Step 1: Check mobile view**
  - Verify "menu" icon appears on small screens.
  - Verify drawer opens from the bottom.
  - Verify buttons inside drawer match auth state.
- [ ] **Step 2: Check desktop view**
  - Verify "menu" icon is hidden.
  - Verify original buttons are visible and functional.
