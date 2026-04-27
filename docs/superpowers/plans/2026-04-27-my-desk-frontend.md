# My Desk Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "My Desk" dashboard for blog management, featuring search, infinite scroll, and a themed compound component.

**Architecture:** 
- **Compound Components**: Use the compound pattern for `MyBlogCard` to ensure flexibility and consistency.
- **Infinite Queries**: Leverage TanStack Query (via tRPC) for performant data fetching.
- **Dynamic Navigation**: Update the global `Header` to adapt to the "My Desk" context.

**Tech Stack:** React, TanStack Router, TanStack Query, tRPC, Tailwind CSS, Lucide (Material Symbols).

---

### Task 1: Create MyBlogCard Compound Component

**Files:**
- Create: `frontend/src/components/MyBlogCard.tsx`

- [ ] **Step 1: Define component structure and types**

```tsx
import React, { createContext, useContext } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface MyBlog {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleted: boolean;
}

interface MyBlogCardContextProps {
  blog: MyBlog;
}

const MyBlogCardContext = createContext<MyBlogCardContextProps | undefined>(undefined);

function useMyBlogCardContext() {
  const context = useContext(MyBlogCardContext);
  if (!context) throw new Error('MyBlogCard components must be used within MyBlogCard.Root');
  return context;
}

export function MyBlogCardRoot({ blog, rotationClass, children }: { blog: MyBlog; rotationClass?: string; children: React.ReactNode }) {
  return (
    <MyBlogCardContext.Provider value={{ blog }}>
      <article className={cn("relative group transition-transform duration-300", rotationClass)}>
        <div className="absolute -right-4 -bottom-4 w-full h-full cross-hatch -z-10"></div>
        <div className="bg-[#FDFCF0] p-8 border-[3px] border-slate-800 shadow-sm relative flex flex-col h-full">
          {children}
        </div>
      </article>
    </MyBlogCardContext.Provider>
  );
}

export function MyBlogCardTitle() {
  const { blog } = useMyBlogCardContext();
  return <h3 className="font-serif italic text-2xl text-slate-900 leading-tight mb-4">{blog.title}</h3>;
}

export function MyBlogCardContent() {
  const { blog } = useMyBlogCardContext();
  return <p className="font-mono text-sm text-slate-700 leading-relaxed mb-6 line-clamp-3">{blog.content}</p>;
}

export function MyBlogCardMetadata() {
  const { blog } = useMyBlogCardContext();
  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return (
    <div className="mt-auto space-y-1 opacity-60 font-mono text-[10px] uppercase">
      <div>Created: {formatDate(blog.createdAt)}</div>
      <div>Updated: {formatDate(blog.updatedAt)}</div>
    </div>
  );
}

export function MyBlogCardStatus() {
  const { blog } = useMyBlogCardContext();
  if (!blog.isDeleted) return null;
  return <span className="absolute top-4 right-4 bg-error/10 text-error border border-error px-2 py-1 font-mono text-[10px] uppercase rotate-12">Deleted</span>;
}

export function MyBlogCardActions() {
  const { blog } = useMyBlogCardContext();
  return (
    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
      <Link to="/my-desk/blog/$blogId" params={{ blogId: blog.id }} className="font-mono text-xs underline decoration-wavy hover:text-primary transition-colors">
        Edit Manuscript
      </Link>
      <span className="material-symbols-outlined text-slate-400" data-icon="edit_note">edit_note</span>
    </div>
  );
}

export const MyBlogCard = Object.assign(MyBlogCardRoot, {
  Title: MyBlogCardTitle,
  Content: MyBlogCardContent,
  Metadata: MyBlogCardMetadata,
  Status: MyBlogCardStatus,
  Actions: MyBlogCardActions,
});
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/MyBlogCard.tsx
git commit -m "feat(frontend): add MyBlogCard compound component"
```

---

### Task 2: Update Header for My Desk Context

**Files:**
- Modify: `frontend/src/components/Header.tsx`

- [ ] **Step 1: Add WriteButton and update visibility logic**

Modify `Header.tsx` to include `HeaderWriteButton` and update `HeaderMyDeskButton` to hide when on the My Desk route.

```tsx
// Inside frontend/src/components/Header.tsx

function HeaderWriteButton({ className }: ButtonProps) {
  const { isAuthenticated } = useHeaderContext();
  if (!isAuthenticated) return null;
  return (
    <Link 
      to="/my-desk/blog/write" 
      className={cn(
        "stamped-ink px-4 py-2 font-typewriter text-sm font-bold uppercase tracking-widest cursor-pointer inline-block text-center no-underline whitespace-nowrap",
        className
      )}
    >
      Write
    </Link>
  );
}

// Update HeaderMyDeskButton
function HeaderMyDeskButton({ className }: ButtonProps) {
  const { isAuthenticated } = useHeaderContext();
  const location = useLocation();
  if (!isAuthenticated || location.pathname.startsWith('/my-desk')) return null;
  // ... rest same
}

// Update Header assignment
export const Header = Object.assign(HeaderRoot, {
  // ... existing
  WriteButton: HeaderWriteButton,
});
```

- [ ] **Step 2: Update Header usage in root**

Modify `frontend/src/routes/__root.tsx` to include the Write button.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Header.tsx frontend/src/routes/__root.tsx
git commit -m "feat(frontend): update header for my-desk context"
```

---

### Task 3: Implement My Desk Index with Infinite Scroll

**Files:**
- Modify: `frontend/src/routes/my-desk/index.tsx`

- [ ] **Step 1: Implement data fetching and layout**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '@/lib/trpc/client'
import { useAppStore } from '@/store/appStore'
import { MyBlogCard } from '@/components/MyBlogCard'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const Route = createFileRoute('/my-desk/')({
  component: MyDeskIndex,
})

const rotations = ['rotate-[-1.5deg]', 'rotate-[0.5deg]', 'rotate-[-2deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]'];

function MyDeskIndex() {
  const debouncedSearchQuery = useAppStore((state) => state.debouncedSearchQuery);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = trpc.myDesk.getMyBlogs.useInfiniteQuery(
    { search: debouncedSearchQuery, take: 6 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'pending') return <div className="text-center font-mono opacity-50 py-20">Opening archives...</div>;
  if (status === 'error') return <div className="text-center font-mono text-error py-20">Failed to reach the desk.</div>;

  const blogs = data.pages.flatMap((page) => page.items);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pb-20">
        {blogs.map((blog, index) => (
          <MyBlogCard key={blog.id} blog={blog} rotationClass={rotations[index % rotations.length]}>
            <MyBlogCard.Status />
            <MyBlogCard.Title />
            <MyBlogCard.Content />
            <MyBlogCard.Metadata />
            <MyBlogCard.Actions />
          </MyBlogCard>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 sketchy-border border-dashed opacity-50">
          <p className="font-serif italic text-xl">No manuscripts found.</p>
          <p className="font-mono text-sm mt-2">Start writing your first entry.</p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <span className="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/routes/my-desk/index.tsx
git commit -m "feat(frontend): implement my-desk blog list with infinite scroll"
```
