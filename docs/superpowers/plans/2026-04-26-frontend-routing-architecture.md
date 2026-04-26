# Frontend Routing Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the frontend to a hierarchical routing architecture with shared layouts and protected routes for the "My Desk" area.

**Architecture:** Use TanStack Router's directory-based layout files (`auth.tsx`, `my-desk.tsx`) to group routes. The `my-desk.tsx` file will implement a `beforeLoad` guard for authentication.

**Tech Stack:** React 19, TanStack Router, Zustand, Tailwind CSS.

---

### Task 1: Update Router Context and Root Route

**Files:**
- Modify: `frontend/src/routes/__root.tsx`

- [ ] **Step 1: Add authentication to router context**
Update `__root.tsx` to include `isAuthenticated` in the route context for use in guards.

```tsx
// frontend/src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
// ... other imports

interface MyRouterContext {
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});
// ...
```

- [ ] **Step 2: Update App component to pass context**
Modify `frontend/src/main.tsx` to pass the store state to the router context.

```tsx
// frontend/src/main.tsx
// ...
function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ isAuthenticated }} />
    </QueryClientProvider>
  );
}
// ...
```

- [ ] **Step 3: Commit**
```bash
git add frontend/src/routes/__root.tsx frontend/src/main.tsx
git commit -m "refactor: add auth to router context"
```

---

### Task 2: Implement Auth Group Layout and Routes

**Files:**
- Create: `frontend/src/routes/auth.tsx`
- Create: `frontend/src/routes/auth/sign-in.tsx`
- Create: `frontend/src/routes/auth/sign-up.tsx`

- [ ] **Step 1: Create Auth Layout**
Minimal layout for authentication pages.

```tsx
// frontend/src/routes/auth.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-8 border-2 border-[#36454F] bg-white shadow-[8px_8px_0px_0px_rgba(54,69,79,1)]">
        <Outlet />
      </div>
    </div>
  ),
})
```

- [ ] **Step 2: Create Sign-In page**
```tsx
// frontend/src/routes/auth/sign-in.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAppStore } from '@/store/appStore'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInComponent,
})

function SignInComponent() {
  const login = useAppStore((state) => state.login)
  const search = Route.useSearch() as { redirect?: string }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl italic">Sign In</h2>
      <p className="font-typewriter text-sm opacity-70">Enter your credentials to access your desk.</p>
      <button 
        onClick={() => {
          login()
          window.location.href = search.redirect || '/my-desk'
        }}
        className="w-full bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold py-3 stamp-btn"
      >
        Sign In (Mock)
      </button>
      <p className="text-center font-typewriter text-xs">
        Don't have an account? <Link to="/auth/sign-up" className="underline">Sign Up</Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create Sign-Up page**
```tsx
// frontend/src/routes/auth/sign-up.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: () => (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl italic">Sign Up</h2>
      <p className="font-typewriter text-sm opacity-70">Join the collective of ink and thought.</p>
      <button className="w-full bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold py-3 stamp-btn">
        Register (Mock)
      </button>
      <p className="text-center font-typewriter text-xs">
        Already registered? <Link to="/auth/sign-in" className="underline">Sign In</Link>
      </p>
    </div>
  ),
})
```

- [ ] **Step 4: Commit**
```bash
git add frontend/src/routes/auth.tsx frontend/src/routes/auth/sign-in.tsx frontend/src/routes/auth/sign-up.tsx
git commit -m "feat: add auth layout and pages"
```

---

### Task 3: Implement Protected "My Desk" Group

**Files:**
- Create: `frontend/src/routes/my-desk.tsx`
- Create: `frontend/src/routes/my-desk/index.tsx`
- Create: `frontend/src/routes/my-desk/blog/$blogId.tsx`
- Create: `frontend/src/routes/my-desk/blog/write.tsx`

- [ ] **Step 1: Create Protected Layout with Guard**
```tsx
// frontend/src/routes/my-desk.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/my-desk')({
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/auth/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => (
    <div className="space-y-8">
      <div className="border-b-2 border-[#36454F] pb-4 flex justify-between items-center">
        <h1 className="font-serif text-2xl italic">Author's Desk</h1>
        <nav className="flex gap-4 font-typewriter text-sm">
          <Link to="/my-desk" className="[&.active]:font-bold">Overview</Link>
          <Link to="/my-desk/blog/write" className="[&.active]:font-bold">Write New</Link>
        </nav>
      </div>
      <Outlet />
    </div>
  ),
})
```

- [ ] **Step 2: Create Dashboard**
```tsx
// frontend/src/routes/my-desk/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-desk/')({
  component: () => (
    <div className="space-y-4 font-typewriter">
      <p>Welcome back, scribe. Your archives await.</p>
      <div className="p-8 border-2 border-dashed border-[#36454F] opacity-50 text-center">
        No recent drafts found.
      </div>
    </div>
  ),
})
```

- [ ] **Step 3: Create Author Blog View & Write Page**
Scaffold these with basic placeholders.

```tsx
// frontend/src/routes/my-desk/blog/$blogId.tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/my-desk/blog/$blogId')({
  component: () => <div className="font-typewriter italic">Author Preview for {$blogId}</div>,
})

// frontend/src/routes/my-desk/blog/write.tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/my-desk/blog/write')({
  component: () => <div className="font-serif text-2xl">New Dispatch Composition...</div>,
})
```

- [ ] **Step 4: Commit**
```bash
git add frontend/src/routes/my-desk.tsx frontend/src/routes/my-desk/index.tsx frontend/src/routes/my-desk/blog/
git commit -m "feat: add protected my-desk layout and routes"
```

---

### Task 4: Final Cleanup and Integration

**Files:**
- Modify: `frontend/src/routes/__root.tsx`
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Clean up global Header logic**
Remove the `showSearch` hack from `__root.tsx` and move it to a more declarative approach if needed, or keep it if it's still globally relevant but simplify it.

- [ ] **Step 2: Verify Routing**
Start the dev server and test:
1. Navigating to `/my-desk` redirects to `/auth/sign-in`.
2. Logging in via mock button redirects back to `/my-desk`.
3. `/auth` routes have their own centered layout.

- [ ] **Step 3: Commit**
```bash
git add frontend/src/routes/__root.tsx
git commit -m "refactor: clean up root layout"
```
