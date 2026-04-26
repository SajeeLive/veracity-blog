# Back Navigation Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Back to Listing" navigation button on the blog details page to return to the home page.

**Architecture:** The button will be placed above the `BlogDetailsCard` in `frontend/src/routes/blog/$blogId.tsx`. It will use TanStack Router's `Link` component and be styled using the project's existing `Button` component and "sketchy" theme.

**Tech Stack:** React, TanStack Router, Tailwind CSS, Material Symbols.

---

### Task 1: Add Back Button to Blog Details Page

**Files:**
- Modify: `frontend/src/routes/blog/$blogId.tsx`

- [ ] **Step 1: Import dependencies**

```tsx
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
```

- [ ] **Step 2: Add navigation button to RouteComponent**

```tsx
function RouteComponent() {
  const { blogId } = Route.useParams()

  // TODO: preloader  
  const { data: post, isLoading, error } = useQuery(
    trpc.blog.getBlogById.queryOptions({ id: blogId })
  )

  if (isLoading) {
    return <BlogDetailsCard.Skeleton />
  }

  if (error || !post) {
    return <div className="text-center font-typewriter text-red-600">Error: Could not retrieve the dispatch.</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <div className="mb-8">
        <Link to="/">
          <Button variant="outline" className="font-typewriter flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
            Back to Listing
          </Button>
        </Link>
      </div>
      <BlogDetailsCard post={post} />
    </div>
  )
}
```

- [ ] **Step 3: Verify navigation visually and functionally**

Run the app, navigate to a blog post, and click the "Back to Listing" button.

- [ ] **Step 4: Commit changes**

```bash
git add frontend/src/routes/blog/\$blogId.tsx
git commit -m "feat: add back navigation button to blog details page"
```
