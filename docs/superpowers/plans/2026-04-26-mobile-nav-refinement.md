# Mobile Navigation Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine mobile navigation to auto-close on route changes and use standardized, reusable button components.

**Architecture:** Use local state and `useEffect` in `HeaderMobileMenu` for auto-closure. Standardize header buttons for reuse in both Desktop and Drawer views.

**Tech Stack:** React, TanStack Router, Shadcn UI (Drawer).

---

### Task 1: Standardize Header Buttons

**Files:**
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Refactor `HeaderAuthButton` to `HeaderLoginButton`**
    - Rename function.
    - Add `className` prop support.
- [ ] **Step 2: Refactor `HeaderUnauthButton` to `HeaderLogoutButton`**
    - Rename function.
    - Add `className` prop support.
- [ ] **Step 3: Update `HeaderMyDeskButton`**
    - Add `className` prop support.
- [ ] **Step 4: Create `HeaderCloseButton`**
    - Implement using `DrawerClose`.

```tsx
// frontend/src/components/Header.tsx changes

// ...
interface ButtonProps {
  className?: string;
}

function HeaderLoginButton({ className }: ButtonProps) {
  const { isAuthenticated } = useHeaderContext();
  if (isAuthenticated) return null;
  return (
    <Link 
      to="/auth/sign-in" 
      className={`stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline whitespace-nowrap ${className || ""}`}
    >
      Log In
    </Link>
  );
}

function HeaderMyDeskButton({ className }: ButtonProps) {
  const { isAuthenticated } = useHeaderContext();
  if (!isAuthenticated) return null;
  return (
    <Link 
      to="/my-desk" 
      className={`stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline whitespace-nowrap ${className || ""}`}
    >
      My Desk
    </Link>
  );
}

function HeaderLogoutButton({ className }: ButtonProps) {
  const { isAuthenticated } = useHeaderContext();
  const logout = useAppStore((state) => state.logout);
  if (!isAuthenticated) return null;
  return (
    <button 
      onClick={logout} 
      className={`stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center border-none whitespace-nowrap ${className || ""}`}
    >
      Logout
    </button>
  );
}

function HeaderCloseButton() {
  return (
    <DrawerClose asChild>
      <Button variant="outline" className="font-typewriter uppercase tracking-widest border-2 border-[#36454F]">
        Close
      </Button>
    </DrawerClose>
  );
}

// Update export assignment
export const Header = Object.assign(HeaderRoot, {
  Title: HeaderTitle,
  Search: HeaderSearch,
  LoginButton: HeaderLoginButton,
  MyDeskButton: HeaderMyDeskButton,
  LogoutButton: HeaderLogoutButton,
  CloseButton: HeaderCloseButton,
  MobileMenu: HeaderMobileMenu,
});
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "refactor(header): standardize and rename nav buttons"
```

---

### Task 2: Implement Auto-Close in HeaderMobileMenu

**Files:**
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Add state and route listener**
- [ ] **Step 2: Use standardized buttons in DrawerContent**

```tsx
// frontend/src/components/Header.tsx

import { useState, useEffect } from "react";
// ...

function HeaderMobileMenu() {
  const { isAuthenticated } = useHeaderContext();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Auto-close on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="md:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
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
            <HeaderLoginButton className="py-4 text-lg" />
            <HeaderMyDeskButton className="py-4 text-lg" />
            <HeaderLogoutButton className="py-4 text-lg" />
          </div>
          <DrawerFooter>
            <HeaderCloseButton />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "feat(header): implement auto-close and reuse buttons in mobile menu"
```

---

### Task 3: Update Root Route Component

**Files:**
- Modify: `frontend/src/routes/__root.tsx`

- [ ] **Step 1: Update Header component names**

```tsx
// frontend/src/routes/__root.tsx

// ...
      <Header isAuthenticated={isAuthenticated}>
        <Header.Title />
        <Header.Search />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Header.LoginButton />
          <Header.MyDeskButton />
          <Header.LogoutButton />
        </div>

        {/* Mobile Navigation */}
        <Header.MobileMenu />
      </Header>
// ...
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/routes/__root.tsx
git commit -m "fix(layout): update header button component names in root layout"
```

---

### Task 4: Verification

- [ ] **Step 1: Verify Desktop Navigation**
    - Confirm Login, My Desk, and Logout buttons work as before.
- [ ] **Step 2: Verify Mobile Navigation**
    - Open drawer.
    - Confirm buttons look correct (larger padding).
    - Click "Log In". Verify drawer closes and navigates.
    - Click "My Desk". Verify drawer closes and navigates.
    - Click "Close". Verify drawer closes.
