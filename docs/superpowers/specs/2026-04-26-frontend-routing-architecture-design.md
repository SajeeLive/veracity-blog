# Frontend Routing Architecture Design - Veracity Blog

**Date:** 2026-04-26
**Status:** Draft
**Topic:** Routing Architecture with TanStack Router

## 1. Objective
Refactor the frontend application to use a well-constructed, hierarchical routing architecture. This includes grouping routes into logical segments (Public, Auth, and Authenticated) with shared layouts and centralized security guards.

## 2. Proposed Architecture

### 2.1 File-Based Route Structure
The application will follow a directory-based layout strategy:

```text
src/routes/
├── __root.tsx              # Global shell (Context Providers, Base styles)
├── index.tsx               # / (Public Home)
├── blog/
│   └── $blogId.tsx         # /blog/:blogId (Public View)
├── auth.tsx                # Layout for Auth group
├── auth/
│   ├── sign-in.tsx         # /auth/sign-in
│   └── sign-up.tsx         # /auth/sign-up
├── my-desk.tsx             # Protected Layout + Guard for /my-desk/*
└── my-desk/
    ├── index.tsx           # /my-desk (Author Dashboard)
    ├── blog/
    │   ├── $blogId.tsx     # /my-desk/blog/:blogId (Author Preview/Editor)
    │   └── write.tsx       # /my-desk/blog/write (New Post)
```

## 3. Implementation Details

### 3.1 Auth Guard (Security)
The `/my-desk` segment is protected via the `beforeLoad` hook in `my-desk.tsx`.

- **Mechanism:** Checks `isAuthenticated` from `appStore`.
- **Action:** If `false`, throws a `redirect({ to: '/auth/sign-in', search: { redirect: location.href } })`.
- **Note:** The redirect logic will ensure the user returns to their requested page after successful authentication.

### 3.2 Layout Strategy
- **`auth.tsx` Layout:** Focused, minimal layout (e.g., centered auth cards, hidden main navigation/search) to maximize conversion and reduce distraction.
- **`my-desk.tsx` Layout:** Workspace-style layout. Includes specific "Author" navigation, logout button, and secondary sidebar/header for draft management.
- **`__root.tsx`:** Stays lightweight. Handles global elements like the `QueryClientProvider` and top-level notifications.

### 3.3 Data Flow
- **Router Context:** The `auth` state will be passed into the Router context at the root level, making it easily accessible in `beforeLoad` hooks and components via `Route.useContext()`.

## 4. Success Criteria
- [ ] Users cannot access any `/my-desk` route without being logged in.
- [ ] Unauthenticated users are redirected to `/auth/sign-in?redirect=...`.
- [ ] Shared layouts correctly render their respective groups.
- [ ] URL structure matches requirements precisely.

## 5. Next Steps
1. Create the `my-desk.tsx` and `auth.tsx` layout files.
2. Implement the `beforeLoad` guard.
3. Scaffold the new route files.
4. Migrate existing logic from `__root.tsx` hacks to group-specific layouts.
